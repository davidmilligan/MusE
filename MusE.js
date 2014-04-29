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
    parse: function(text, outputElement, scale)
    {
        if(typeof(scale)==='undefined') scale = 1;
        
        this.clearErrors();
        this.document = new MDocument(text);
        this.document.Parse();
        
        outputElement.innerHTML = this.document.GenerateSVG(outputElement.offsetWidth, scale);
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

//source/credits: https://github.com/ofa-/notes/tree/master/i
var svgDrawings =
{
    TrebleClef: '<g transform="matrix(0.38,0,0,0.4,0,-17)"><path d="M 46.63,132.558 C 44.854,132.846 42.909,132.991 40.798,132.991 C 36.333,132.991 33.046,132.487 30.935,131.479 C 24.214,128.262 19.462,124.301 16.677,119.597 C 14.661,116.189 13.462,111.677 13.077,106.06 C 12.741,101.404 13.845,96.532 16.389,91.443 C 18.549,87.075 21.344,83.27 24.776,80.03 C 28.208,76.79 32.085,73.538 36.405,70.273 C 36.165,69.073 35.829,66.697 35.397,63.144 C 35.157,59.832 35.038,57.551 35.038,56.303 C 35.038,52.847 35.325,49.559 35.901,46.438 C 36.477,43.606 37.94,40.294 40.293,36.501 C 42.885,32.325 45.141,30.213 47.062,30.164 C 48.646,30.164 50.41,32.541 52.354,37.293 C 54.297,42.046 55.318,46.127 55.414,49.535 C 55.51,54.048 55.054,57.936 54.046,61.201 C 53.374,63.361 52.126,66.05 50.302,69.265 C 49.534,70.562 47.95,72.698 45.55,75.674 C 44.878,76.539 43.989,77.427 42.886,78.339 C 41.926,79.06 40.99,79.804 40.078,80.571 L 42.454,94.541 C 43.078,94.445 43.774,94.397 44.542,94.397 C 48.91,94.397 52.294,95.286 54.694,97.061 C 59.206,100.373 61.677,105.102 62.11,111.247 C 62.446,115.519 61.486,119.479 59.23,123.128 C 56.781,127.112 53.181,130.089 48.429,132.058 C 49.052,136.426 49.676,140.603 50.301,144.587 C 50.637,146.986 50.805,149.026 50.805,150.707 C 50.805,153.011 50.445,154.835 49.725,156.18 C 47.084,161.124 43.077,163.765 37.703,164.101 C 34.486,164.292 31.342,163.621 28.269,162.084 C 24.429,160.211 22.414,157.498 22.222,153.945 C 22.031,151.351 22.534,149.142 23.734,147.318 C 25.078,145.157 27.07,144.005 29.711,143.861 C 31.535,143.716 33.262,144.304 34.895,145.626 C 36.528,146.945 37.415,148.589 37.559,150.557 C 37.895,154.877 35.231,157.829 29.567,159.413 C 30.864,161.284 33.456,162.221 37.344,162.221 C 39.406,162.221 41.422,161.597 43.391,160.349 C 45.359,159.101 46.87,157.54 47.927,155.669 C 48.599,154.421 48.935,152.524 48.935,149.981 C 48.935,148.445 48.815,146.717 48.575,144.797 C 47.901,140.718 47.253,136.638 46.63,132.558 z M 42.094,104.622 C 38.589,104.718 35.948,105.942 34.173,108.294 C 32.829,110.118 32.23,112.158 32.374,114.414 C 32.421,116.094 33.034,117.81 34.21,119.562 C 35.386,121.314 36.669,122.549 38.062,123.27 C 37.822,123.414 37.582,123.677 37.343,124.062 C 34.558,122.718 32.517,121.158 31.222,119.382 C 29.302,116.789 28.222,113.909 27.982,110.741 C 27.837,108.63 28.318,106.422 29.423,104.117 C 30.622,101.621 32.374,99.485 34.677,97.709 C 36.406,96.365 38.373,95.43 40.581,94.901 L 38.421,81.869 C 36.79,82.83 34.439,84.702 31.366,87.485 C 27.573,90.893 24.813,93.941 23.087,96.629 C 19.341,102.438 17.638,107.453 17.974,111.677 C 18.359,116.909 20.734,121.409 25.103,125.178 C 29.47,128.945 34.607,130.829 40.51,130.829 C 42.43,130.829 44.35,130.612 46.27,130.181 C 44.829,121.638 43.438,113.118 42.094,104.622 z M 48.141,41.334 C 45.117,41.334 42.62,43.662 40.653,48.318 C 38.781,52.638 37.845,57.654 37.845,63.365 C 37.845,65.238 37.965,67.038 38.205,68.765 C 41.996,65.789 45.212,62.526 47.852,58.973 C 51.164,54.557 52.701,50.742 52.46,47.526 C 52.173,43.351 50.732,41.286 48.141,41.334 z M 43.965,104.479 L 47.997,129.607 C 54.093,127.543 56.877,122.815 56.35,115.423 C 55.773,107.79 51.645,104.143 43.965,104.479 z"/></g>\n',
    BassClef: '<g transform="matrix(0.38,0,0,0.4,0,-17)"><path d="M 51.936,96.822 C 50.448,99.557 48.576,102.245 46.32,104.885 C 44.064,107.525 41.664,109.756 39.12,111.58 C 36.192,113.74 32.568,115.636 28.248,117.268 C 25.56,118.276 21.696,119.236 16.656,120.148 L 16.152,119.068 C 18.599,118.252 20.88,117.364 22.992,116.404 C 28.032,114.148 31.8,111.7 34.296,109.061 C 42.359,100.661 46.272,90.461 46.032,78.463 C 45.983,74.432 45.288,70.999 43.944,68.167 C 42.024,64.088 39.072,62.048 35.088,62.048 C 32.256,62.048 29.544,63.032 26.952,65 C 24.12,67.112 22.824,69.464 23.064,72.056 C 23.112,72.201 23.208,72.272 23.352,72.272 C 25.992,71.6 27.936,71.289 29.184,71.336 C 30.864,71.385 32.255,72.2 33.36,73.784 C 34.368,75.177 34.872,76.832 34.872,78.752 C 34.872,80.815 34.283,82.52 33.107,83.864 C 31.931,85.207 30.287,85.88 28.175,85.88 C 25.727,85.88 23.663,85.088 21.984,83.504 C 20.16,81.871 19.248,79.735 19.248,77.096 C 19.103,70.376 21.768,65.504 27.24,62.48 C 30.216,60.849 33.504,60.009 37.104,59.96 C 40.799,59.864 44.4,61.028 47.904,63.452 C 51.408,65.876 53.832,68.96 55.176,72.703 C 55.991,74.959 56.4,77.383 56.4,79.974 C 56.4,82.23 56.112,84.725 55.536,87.461 C 54.911,90.342 53.711,93.462 51.936,96.822 z M 59.207,69.104 C 59.158,68 59.519,67.089 60.287,66.369 C 61.055,65.649 61.991,65.265 63.095,65.217 C 64.199,65.217 65.147,65.566 65.939,66.261 C 66.731,66.957 67.127,67.858 67.127,68.961 C 67.175,70.065 66.803,71.014 66.011,71.806 C 65.219,72.598 64.295,72.994 63.24,72.994 C 62.136,73.042 61.187,72.682 60.395,71.914 C 59.603,71.146 59.207,70.209 59.207,69.104 z M 59.207,87.249 C 59.207,86.192 59.591,85.293 60.358,84.55 C 61.126,83.805 62.062,83.409 63.167,83.362 C 64.271,83.362 65.207,83.721 65.975,84.442 C 66.743,85.162 67.151,86.049 67.2,87.106 C 67.2,88.21 66.815,89.157 66.048,89.95 C 65.28,90.741 64.368,91.138 63.313,91.138 C 62.209,91.186 61.26,90.826 60.468,90.059 C 59.675,89.289 59.255,88.353 59.207,87.249 z"/></g>\n',
    WholeNoteHead: '<g transform="scale(0.634,0.634)" > <path d="M 9.125,0.0030002594 C 4.03428,0.18520026 0,2.5856003 0,5.5030003 C 0,8.5390003 4.368,11.003 9.75,11.003 C 15.132,11.003 19.5,8.5390003 19.5,5.5030003 C 19.5,2.4670003 15.132,0.0030002594 9.75,0.0030002594 C 9.53977,0.0030002594 9.33194,-0.0043997406 9.125,0.0030002594 z M 7.5,1.0655003 C 8.8579,0.92650026 10.56798,1.5561003 12,2.8467003 C 14.14502,4.7799003 14.87122,7.4906003 13.625,8.9092003 L 13.59375,8.9405003 C 12.32289,10.3506 9.53145,9.9153003 7.375,7.9717003 C 5.21855,6.0282003 4.51039,3.2881003 5.78125,1.8780003 C 6.20818,1.4043003 6.81306,1.1358003 7.5,1.0655003 z " fill="black"/></g>\n',
    WhiteNoteHead: '<g transform="translate(-176.0000,-536.3480)" > <path d="M 183.32825,537.99494 C 183.25004,538.79049 182.64569,539.39862 182.13138,539.95603 C 180.97913,541.06357 179.56711,541.94914 178.01121,542.32187 C 177.55025,542.40218 176.80690,542.47930 176.67383,541.87610 C 176.54514,541.23787 177.02374,540.67784 177.38470,540.20578 C 178.32107,539.11438 179.54806,538.29916 180.84608,537.71532 C 181.52160,537.46034 182.30762,537.13863 183.01565,537.44746 C 183.20917,537.55686 183.34251,537.76645 183.32825,537.99494 z M 181.39173,536.34800 C 179.63336,536.36064 177.96477,537.33707 176.88097,538.70616 C 176.15644,539.64489 175.67538,541.00514 176.26344,542.13082 C 176.70654,543.03586 177.76412,543.39482 178.70619,543.34316 C 180.33110,543.30889 181.83790,542.40806 182.91461,541.21868 C 183.71165,540.30383 184.29905,538.98012 183.83740,537.77066 C 183.50354,536.89010 182.58732,536.37839 181.68335,536.35743 C 181.58628,536.35097 181.48896,536.34796 181.39173,536.34800 z" fill="black"/></g>\n',
    BlackNoteHead: '<g transform="translate(-176.0000,-536.3480)" > <path d="M181.4,536.3c-1.8,0-3.4,1-4.5,2.4c-0.7,0.9-1.2,2.3-0.6,3.4c0.4,0.9,1.5,1.3,2.4,1.2c1.6,0,3.1-0.9,4.2-2.1c0.8-0.9,1.4-2.2,0.9-3.4c-0.3-0.9-1.3-1.4-2.2-1.4C181.6,536.4,181.5,536.3,181.4,536.3z" fill="black"/></g>\n',
}



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
                            currentGroup.Notes.push(new MNote(currentPitch,currentTimes[i]));
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
                        groups.push(newGroup);
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
                                currentGroup.Notes.push(namedGroups[currentText].Clone());
                            }
                            else
                            {
                                getCurrentVoice().Notes.push(namedGroups[currentText].Clone());
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
                                currentGroup.Notes.push(clef);
                            }
                            else
                            {
                                getCurrentVoice().Notes.push(clef);
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
                        times.push(newTime);
                        position = offset + 1;
                    }
                }
            }
        }
        return times;
    };
    
    this.SVG = "";
    this.GenerateSVG = function(maxWidth,scale)
    {
        this.SVG = "<svg>";
        var currentTime = 0;
        var clefWidth = 40 * scale;
        var noteHeight = 7;
        var noteWidth = 8;
        var staffXOffset = 0 * scale;
        var clefXOffset = 5 * scale;
        var xscale = scale * noteWidth;
        var yscale = scale * noteHeight;
        var noteSpacing = xscale * 2;
        var staffSpacing = yscale * 4;
        var x = staffXOffset;
        var y = staffSpacing;
        var minStep = 0;
        var clefDrawn = false;
        var newLine = true;
        do
        {
            if (newLine)
            {
                //draw staves
                var staffY = y;
                clefDrawn = false;
                for(var i in this.Staves)
                {
                    for(var j = 0; j <= 4; j++)
                    {
                        staffY += yscale;
                        this.SVG += '<rect x="' + x + '" y="' + staffY + '" width="' + maxWidth + '" height="1" fill="black" />\n';
                    }
                    staffY += staffSpacing * this.Staves[i].StaffSpacingCoefficient;
                }
                x = staffXOffset + clefXOffset + clefWidth;
                newLine = false;
            }
            minStep = Infinity;
            var staffY = y;
            for(var i in this.Staves)
            {
                minStep = Math.min(minStep, this.Staves[i].Step(currentTime, x, staffY));
                staffY += yscale * 4 + staffSpacing * this.Staves[i].StaffSpacingCoefficient;
                if (!clefDrawn)
                {
                    for(var i in this.Staves)
                    {
                        if (this.Staves[i].currentClef != null)
                        {
                            this.SVG += '<g transform="translate(' + staffXOffset + clefXOffset + ',' + y + ')"><g transform="scale(' + scale + ',' + scale + ')">\n' + this.Staves[i].currentClef.SVG + '</g></g>\n';
                        }
                    }
                }
            }
            clefDrawn = true;
            currentTime += minStep;
            x += xscale + noteSpacing;
            if (x > maxWidth)
            {
                //new line
                x = staffXOffset;
                y = staffY;
                newLine = true;
            }
            
        }
        while(minStep > 0);
        for(var i in this.Staves)
        {
            this.SVG += this.Staves[i].Draw(scale,xscale,yscale);
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
    this.currentClef = null;
    this.Step = function(currentTime, x, y)
    {
        var minStep = Infinity;
        for(var i in this.Voices)
        {
            minStep = Math.min(minStep, this.Voices[i].Step(currentTime, x, y));
            this.currentClef = this.Voices[i].currentClef;
        }
        return minStep;
    };
    this.Draw = function(scale,xscale,yscale)
    {
        this.SVG = "";
        for(var i in this.Voices)
        {
            this.SVG += this.Voices[i].Draw(scale,xscale,yscale) + "\n";
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
    this.currentClef = null;
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
    this.Draw = function(scale,xscale,yscale)
    {
        this.SVG = "";
        var notes = this.GetNotes();
        for(var i in notes)
        {
            this.SVG += notes[i].Draw(scale,xscale,yscale) + "\n";
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
    this.Draw = function(scale,xscale,yscale)
    {
        this.SVG = "";
        for(var i in this.Pitches)
        {
            var yPosition = this.DrawY + yscale * (5 + this.Clef.Pitch.GetValue() - this.Pitches[i].GetValue()) / 2;
            //leger lines
            for(var j = 10; j <= 6 + this.Clef.Pitch.GetValue() - this.Pitches[i].GetValue(); j+=2)
            {
                this.SVG += '<rect x="' + (this.DrawX - xscale * 0.75) + '" y="' + (this.DrawY + yscale * j / 2) + '" width="' + (xscale * 1.5) + '" height="1" fill="black"/>\n';
            }
            for(var j = 0; j >= 6 + this.Clef.Pitch.GetValue() - this.Pitches[i].GetValue(); j-=2)
            {
                this.SVG += '<rect x="' + (this.DrawX - xscale * 0.75) + '" y="' + (this.DrawY + yscale * j / 2) + '" width="' + (xscale * 1.5) + '" height="1" fill="black"/>\n';
            }
            var up = this.Pitches[i].GetValue() < this.Clef.Pitch.GetValue();
            this.SVG += this.Time.Draw(this.DrawX, yPosition, scale, xscale, yscale, up);
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
        return this.Name.charCodeAt(0) - "A".charCodeAt(0)  + 7 * (this.Octave + (this.Name.charCodeAt(0) < "C".charCodeAt(0) ? 1 : 0));
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
    this.Draw = function(x,y,scale,xscale,yscale,up)
    {
        this.SVG = "";
        
        this.SVG += '<g transform="translate(' + (x - xscale/2) + ',' + y + ')"><g transform="scale(' + scale + ',' + scale + ')">\n';
        if (this.Values[0] == 1)
        {
            this.SVG += svgDrawings.WholeNoteHead;
        }
        else if (this.Values[0] == 2)
        {
            this.SVG += svgDrawings.WhiteNoteHead;
        }
        else
        {
            this.SVG += svgDrawings.BlackNoteHead;  
        }
        this.SVG += '</g></g>\n';
        if (this.Values[0] > 1)
        {
            var flagHeight = yscale * 3 + scale;
            var flagTop = y;
            var xFlag = x;
            if (up)
            {
                xFlag += xscale/2 - scale;
                flagTop -= flagHeight - scale;
            }
            else
            {
                xFlag -= xscale/2;
                flagTop += yscale - scale;
            }
            this.SVG += '<rect x="' + xFlag + '" y="' + flagTop + '" width="' + scale + '" height="' + flagHeight + '" fill="black" />\n';
            
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

MClef = function(pitch,svg)
{
    this.Pitch = pitch; //the pitch of the center line
    this.SVG = svg;
    this.Type = "MClef";
    this.GetNotes = function()
    {
        return [this];
    };
    this.Draw = function(scale,xscale,yscale){ return ""; };
}

//pre-defined cleffs
muse.settings.clefs["G"] = new MClef(new MPitch("B"),svgDrawings.TrebleClef);
muse.settings.clefs["G"].Pitch.Octave = 4;

muse.settings.clefs["F"] = new MClef(new MPitch("D"),svgDrawings.BassClef);
muse.settings.clefs["F"].Pitch.Octave = 3;


isDigit = function(ch)
{
    return ch.charCodeAt(0) >= "0".charCodeAt(0) && ch.charCodeAt(0) <= "9".charCodeAt(0);
};

isWhitespace = function(ch)
{
    return ch == " " || ch == "\t" || ch == "\r" || ch == "\n";
};