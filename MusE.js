/*********************************************************************
  muse - a musical programming language
   by David Milligan
**********************************************************************/

/*********************************************************************
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
**********************************************************************/

muse =
{
    document: null,
    parse: function(text, outputElement, xscale, yscale, noteSpacing, staffSpacing)
    {
        if(typeof(xscale)==='undefined') xscale = 15;
        if(typeof(yscale)==='undefined') yscale = 10;
        if(typeof(noteSpacing)==='undefined') noteSpacing = 20;
        if(typeof(staffSpacing)==='undefined') staffSpacing = 50;
        
        this.clearErrors();
        this.document = new MDocument(text);
        this.document.Parse();
        
        outputElement.innerHTML = this.document.GenerateSVG(outputElement.offsetWidth, xscale, yscale, noteSpacing, staffSpacing);
    },
    error: function(message)
    {
        var stderr = document.getElementById('stderr');
        if (stderr != null)
        {
            var err = document.createElement('p');
            if (this.document != null && this.document.currentLine != null)
            {
                err.textContent = "Parse Error (" + this.document.currentLine + ", " + this.document.currentLineOffset + "): " + message;
            }
            else
            {
                err.textContent = message;
            }
            stderr.appendChild(err);
        }
    },
    clearErrors: function()
    {
        var stderr = document.getElementById('stderr');
        if (stderr != null)
        {
            stderr.innerHTML = "";
        }
    },
    settings:
    {
        clefs: new Array()
    }
};


MDocument = function(text)
{
    this.Text = text;
    this.MaxWidth = 400;
    this.NoteSize = 5;
    this.Staves = new Array();
    this.currentLine = 1;
    this.currentLineOffset = 0;
    this.position = 0;
    this.offset = 0;
    this.Type = "MDocument";
    this.Parse = function()
    {
        var currentPitch = null;
        var currentStaff = null;
        var currentVoice = null;
        var currentGroup = null;
        var namedGroups = new Array();
        var groups = new Array();
        var varStarted = false;
        var clefStarted = false;
        
        var getCurrentVoice = function()
        {
            if (currentVoice == null)
            {
                if (currentStaff == null)
                {
                    currentStaff = new MStaff(currentText);
                    this.Staves.push(currentStaff);
                }
                currentVoice = new MVoice(currentText);
                currentStaff.Voices.push(currentVoice);
            }
            return currentVoice;
        }
        
        for(position = 0; position < this.Text.length; position++)
        {
            for(offset = position; offset < this.Text.length; offset++)
            {
                if (this.Text[offset] == '\n')
                {
                    this.currentLine++;
                    this.currentLineOffset = 0;
                }
                else
                {
                    this.currentLineOffset++;
                }
                if(this.Text[offset] == '|' ||
                   this.Text[offset] == ':' ||
                   this.Text[offset] == '{' ||
                   this.Text[offset] == '}' ||
                   this.Text[offset] == '(' ||
                   this.Text[offset] == ')' ||
                   this.Text[offset] == '=' ||
                   this.Text[offset] == '$' ||
                   this.Text[offset] == '%')
                {
                    break;
                }
            }
            var currentText = this.Text.substring(position,offset);
            switch(this.Text[offset])
            {
                case '|':
                    if(this.Text[offset+1] == '=')
                    {
                        currentStaff = new MStaff(currentText);
                        this.Staves.push(currentStaff);
                    }
                    else
                    {
                        muse.error("Parse error at offset " + offset);
                    }
                    position = offset + 1;
                    muse.currentColumn++;
                    break;
                case ':':
                    if(this.Text[offset+1] == '=')
                    {
                        if (currentStaff == null)
                        {
                            currentStaff = new MStaff(currentText);
                            this.Staves.push(currentStaff);
                        }
                        currentVoice = new MVoice(currentText);
                        currentStaff.Voices.push(currentVoice);
                    }
                    else
                    {
                        muse.error("Parse error at offset " + offset);
                    }
                    position = offset + 1;
                    muse.currentColumn++;
                    break;
                case '{':
                    currentPitch = this.ParsePitch(currentText);
                    position = offset;
                    break;
                case '}':
                    var currentTimes = this.ParseTime(currentText);
                    if (currentGroup != null)
                    {
                        for(var i in currentTimes)
                        {
                            currentGroup.push(new MNote(currentPitch,currentTimes[i]));
                        }
                    }
                    else
                    {
                        for(var i in currentTimes)
                        {
                            getCurrentVoice().Notes.push(new MNote(currentPitch,currentTimes[i]));
                        }
                    }
                    position = offset;
                    break;
                case '(':
                    if (currentGroup != null)
                    {
                        var newGroup = new MGroup();
                        currentGroup.Notes.push(newGroup);
                        groups.push(newGroup);
                        currentGroup = newGroup;
                    }
                    else
                    {
                        currentGroup = new MGroup();
                        getCurrentVoice().Notes.push(currentGroup);
                    }
                    position = offset;
                    break;
                case '=':
                    if (currentGroup != null)
                    {
                        currentGroup.Name = currentText;
                        namedGroups[currentText] = currentGroup;
                    }
                    break;
                case ')':
                    if (groups.length > 0)
                    {
                        groups.pop();
                        if (groups.length > 0)
                        {
                            currentGroup = groups[groups.length - 1];
                        }
                        else
                        {
                            currentGroup = null;
                        }
                    }
                    else
                    {
                        muse.error("illegal char ')'");
                    }
                    position = offset;
                    break;
                case '$':
                    if (varStarted)
                    {
                        if (namedGroups[currentText] != null)
                        {
                            if (currentGroup != null)
                            {
                                currentGroup.push(namedGroups[currentText]);
                            }
                            else
                            {
                                getCurrentVoice().Notes.push(namedGroups[currentText]);
                            }
                        }
                    }
                    varStarted = !varStarted;
                    position = offset;
                    break;
                case '%':
                    if (clefStarted)
                    {
                        var clef = muse.settings.clefs[currentText];
                        if (clef == null)
                        {
                            clef = new MClef(this.ParsePitch(currentText));
                        }
                        if (clef != null)
                        {
                            if (currentGroup != null)
                            {
                                currentGroup.push(new MNote(currentPitch,currentTimes[i]));
                            }
                            else
                            {
                                getCurrentVoice().Notes.push(new MNote(currentPitch,currentTimes[i]));
                            }
                        }
                    }
                    clefStarted = !clefStarted;
                    position = offset;
                    break;
            }
        }
        muse.currentLine = 0;
    };
    
    this.ParsePitch = function(text)
    {
        var pitches = new Array();
        var state = 1;
        for(var position = 0; position < text.length; position++)
        {
            if(!isWhitespace(text[position]))
            {
                var newPitch = null;
                var offset = 0;
                for(offset = position; offset < text.length; offset++)
                {
                    if(state == 1)
                    {
                        if((text.charCodeAt(offset) >= 'A'.charCodeAt(0) && text.charCodeAt(offset) <= 'G'.charCodeAt(0)) || text[offset] == '~')
                        {
                            newPitch = new MPitch(text[offset]);
                            pitches.push(newPitch);
                            state++;
                            position = offset;
                            continue;
                        }
                        else
                        {
                            muse.error("illegal char");
                        }
                    }
                    if(state == 2)
                    {
                        if(text[offset] == '#')
                        {
                            newPitch.Mod++;
                        }
                        else if(text[offset] == 'b')
                        {
                            newPitch.Mod--;
                        }
                        else
                        {
                            state++;
                            position = offset;
                        }
                    }
                    if(state == 3)
                    {
                        if(!(isDigit(text[offset]) || text[offset] == '+' || text[offset] == '-') || offset == text.length - 1)
                        {
                            if(offset == text.length - 1)
                            {
                                offset++;
                            }
                            if(offset > position)
                            {
                                var num = text.substring(position,offset);
                                if (isNaN(Number(num)))
                                {
                                    muse.error("Could not convert to number: " + num);
                                }
                                newPitch.Octave = Number(num);
                                position = offset - 1;
                            }
                            else
                            {
                                position = offset;
                            }
                            
                            state = 1;
                            break;
                        }
                    }
                }
                if (offset >= text.length)
                {
                    break;
                }
            }
        }
        return pitches;
    
    };
    
    this.ParseTime = function(text)
    {
        var times = new Array();
        var newTime = new MTime();
        times.push(newTime);
        for(var position = 0; position < text.length; position++)
        {
            if(!isWhitespace(text[position]))
            {
                var offset = 0;
                for(offset = position; offset < text.length; offset++)
                {
                    if(text[offset] == '&' || text[offset] == ',' || offset == text.length - 1)
                    {
                        var num = text.substring(position, offset + (offset == text.length - 1 ? 1 : 0));
                        if (isNaN(Number(num)))
                        {
                            muse.error("Could not convert to number: " + num);
                        }
                        newTime.Values.push(Number(num));
                        position = offset + 1;
                    }
                    if(text[offset] == ',')
                    {
                        newTime = new MTime();
                        position = offset + 1;
                    }
                }
            }
        }
        return times;
    };
    
    this.SVG = "";
    this.GenerateSVG = function(maxWidth,xscale,yscale,noteSpacing,staffSpacing)
    {
        this.SVG = "<svg>";
        var currentTime = 0;
        var x = noteSpacing;
        var y = staffSpacing;
        var minStep = 0;
        do
        {
            if (x == noteSpacing)
            {
                //draw staves
                var staffY = y;
                for(var i in this.Staves)
                {
                    for(var j = 0; j <= 4; j++)
                    {
                        staffY += yscale;
                        this.SVG += '<line x1="' + x + '" y1="' + staffY + '" x2="' + maxWidth + '" y2="' + staffY + '" stroke-width="1" stroke="black" />\n';
                    }
                    staffY += staffSpacing * this.Staves[i].StaffSpacingCoefficient;
                }
                x += xscale + noteSpacing;
                //TODO: draw clef
            }
            minStep = Infinity;
            var staffY = y;
            for(var i in this.Staves)
            {
                minStep = Math.min(minStep, this.Staves[i].Step(currentTime, x, staffY));
                staffY += yscale * 4 + staffSpacing * this.Staves[i].StaffSpacingCoefficient;
            }
            currentTime += minStep;
            x += xscale + noteSpacing;
            if (x > maxWidth)
            {
                //new line
                x = noteSpacing;
                y = staffY;
            }
            
        }
        while(minStep > 0);
        for(var i in this.Staves)
        {
            this.SVG += this.Staves[i].Draw(xscale,yscale);
        }
        
        this.SVG += "</svg>"
        return this.SVG;
    };
};


MStaff = function(name)
{
    this.Name = name;
    this.Voices = new Array();
    this.SVG = "";
    this.StaffSpacingCoefficient = 1.0;
    this.Type = "MStaff";
    this.Step = function(currentTime, x, y)
    {
        var minStep = Infinity;
        for(var i in this.Voices)
        {
            minStep = Math.min(minStep, this.Voices[i].Step(currentTime, x, y));
        }
        return minStep;
    };
    this.Draw = function(xscale,yscale)
    {
        this.SVG = "";
        for(var i in this.Voices)
        {
            this.SVG += this.Voices[i].Draw(xscale,yscale) + "\n";
        }
        return this.SVG;
    };
};

MVoice = function(name)
{
    this.Name = name;
    this.Notes = new Array();
    this.SVG = "";
    this.Type = "MVoice";
    this.Step = function(currentTime, x, y)
    {
        if (currentTime == 0)
        {
            this.SVG = "";
            this.currentClef = muse.settings.clefs["G"];//default to treble clef
            this.notesTemp = this.GetNotes().reverse();
        }
        if (this.notesTemp.length == 0)
        {
            return 0;
        }
        else
        {
            if (this.currentNote == null && currentTime == 0)
            {
                this.currentNote = this.notesTemp.pop();
                this.CheckClef();
                if (this.currentNote != null)
                {
                    this.nextNoteTime = this.currentNote.Time.GetValue();
                    this.currentNote.Step(x,y,this.currentClef);
                    return this.currentNote.Time.GetValue();
                }
            }
            else if (this.nextNoteTime <= currentTime)
            {
                this.currentNote = this.notesTemp.pop();
                this.CheckClef();
                if (this.currentNote != null)
                {
                    this.nextNoteTime = this.currentNote.Time.GetValue();
                    this.currentNote.Step(x,y,this.currentClef);
                    return this.currentNote.Time.GetValue();
                }
            }
        }
        return 0;
    };
    this.CheckClef = function()
    {
        while(this.currentNote != null && this.currentNote.Type == "MClef")
        {
            this.currentClef = this.currentNote;
            this.currentNote = this.notesTemp.pop();
        }
        return this.currentNote;
    };
    this.Draw = function(xscale,yscale)
    {
        this.SVG = "";
        var notes = this.GetNotes();
        for(var i in notes)
        {
            this.SVG += notes[i].Draw(xscale,yscale) + "\n";
        }
        return this.SVG;
    };
    this.GetNotes = function()
    {
        var result = new Array();
        for(var i in this.Notes)
        {
            var notes = this.Notes[i].GetNotes();
            for(var j in notes)
            {
                result.push(notes[j]);
            }
        }
        return result;
    };
};

MNote = function(pitches, time)
{
    this.Pitches = pitches;
    this.Time = time;
    this.SVG = "";
    this.Type = "MNote";
    this.GetNotes = function()
    {
        return [this];
    };
    this.Step = function(x,y,clef)
    {
        this.DrawX = x;
        this.DrawY = y;
        this.Clef = clef;
    }
    this.Draw = function(xscale,yscale)
    {
        this.SVG = "";
        for(var i in this.Pitches)
        {
            var yPosition = this.DrawY + yscale * (6 + this.Clef.Pitch.GetValue() - this.Pitches[i].GetValue()) / 2;
            var up = this.Pitches[i].GetValue() > this.Clef.Pitch.GetValue();
            this.SVG += this.Time.Draw(this.DrawX, yPosition, xscale, yscale, up);
        }
        return this.SVG;
    };
};

MPitch = function(name)
{
    this.Name = name;
    this.Mod = 0;
    this.Octave = 0;
    this.Type = "MPitch";
    this.GetValue = function()
    {
        return this.Name.charCodeAt(0) - "A".charCodeAt(0) + 7 * (this.Octave + (this.Name.charCodeAt(0) < "C".charCodeAt(0) ? 1 : 0));
    };
};

MTime = function()
{
    this.Values = new Array();
    this.Type = "MTime";
    this.SVG = "";
    this.GetValue = function()
    {
        var total = 0;
        for(var i in this.Values)
        {
            total += 1.0/this.Values[i];
        }
        return total;
    };
    this.Draw = function(x,y,xscale,yscale,up)
    {
        this.SVG = "";
        this.SVG += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (xscale/2) + '" ry="' + (yscale/2) + '" stroke-width="1" stroke="black" style="fill:' + (this.Values[0] >= 4?"black" : "transparent") + '" />\n';
        if (this.Values[0] > 1)
        {
            var yFlag = y;
            var xFlag = x;
            if (up)
            {
                xFlag -= xscale/2;
                yFlag += yscale * 4;
            }
            else
            {
                xFlag += xscale/2;
                yFlag -= yscale * 4;
            }
            this.SVG += '<line x1="' + xFlag + '" y1="' + y + '" x2="' + xFlag + '" y2="' + yFlag + '" stroke-width="1" stroke="black" />\n';
            
        }
        return this.SVG;
    };
};

MGroup = function()
{
    this.Name = "";
    this.Notes = new Array();
    this.Type = "MGroup";
    this.GetNotes = function()
    {
        var result = new Array();
        for(var i in this.Notes)
        {
            var notes = this.Notes[i].GetNotes();
            for(var j in notes)
            {
                result.push(notes[j]);
            }
        }
        return result;
    }
}

MClef = function(pitch)
{
    this.Pitch = pitch; //the pitch of the center line
    this.Type = "MClef";
    this.GetNotes = function()
    {
        return [this];
    };
}

//pre-defined cleffs
muse.settings.clefs["G"] = new MClef(new MPitch("B"))
muse.settings.clefs["G"].Pitch.Octave = 4;

muse.settings.clefs["F"] = new MClef(new MPitch("D"))
muse.settings.clefs["F"].Pitch.Octave = 3;


isDigit = function(ch)
{
    return ch.charCodeAt(0) >= "0".charCodeAt(0) && ch.charCodeAt(0) <= "9".charCodeAt(0);
};

isWhitespace = function(ch)
{
    return ch == " " || ch == "\t" || ch == "\r" || ch == "\n";
};