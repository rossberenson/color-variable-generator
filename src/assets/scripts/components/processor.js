import ntc, { name } from 'ntc';
// import color from 'color';
import rainbowSort from 'rainbow-sort';

const symbols = {
    css: '--',
    sass: '$',
    less: '@',
}

/**
 * Enable or disable RGB Varient if Convert to RGB is enabled.
 *
 * @param   object  convertToRGB   convertToRGB Element
 * @param   object  addRGBVarient  addRGBVarient Element
 */
function toggleRGBVarientOption(convertToRGB, addRGBVarient) {
    convertToRGB.addEventListener('change', function () {
        if (this.checked == true) {
            addRGBVarient.disabled = true;
            if (addRGBVarient.checked === true) {
                addRGBVarient.checked = false;
            }
        } else {
            addRGBVarient.disabled = false;
        }
    });
}

function hexStringsToArray(data) {
    // Build an array for each line of hex values
    const allLines = data.match(/\S+/g) || [];
    const array = [];
    const currentLine = "";

    for (let i = 0; i < allLines.length; i++) {
        const newLine = currentLine + allLines[i] + " ";
        array.push(newLine.trim());
    }
    return array;
}

function convertToSlug(text) {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}

/**
 * Convert Hex to RGB
 * Thanks, css-tricks! https://css-tricks.com/converting-color-spaces-in-javascript/
 *
 * @param   string  hex  hex value
 *
 * @return  string     raw rgb value (without rgb() )
 */
function hexToRGB(hex) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];

        // 6 digits
    } else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }

    return +r + "," + +g + "," + +b;
}

const Processor = function () {
    const hexInput = document.querySelector('.hex-input');
    const hexOutput = document.querySelector('.hex-output');
    const selectedLanguage = document.querySelector('.generate-language');
    const varPrefix = document.querySelector('.prefix-input');
    const convertToRGB = document.querySelector('.convert-rgb');
    const addRGBVarient = document.querySelector('.rgb-varient');
    const generate = document.querySelector('.button-generate');

    toggleRGBVarientOption(convertToRGB, addRGBVarient);

    generate.addEventListener('click', function () {
        const hexValues = hexInput.value;

        // Clear output
        hexOutput.value = '';

        if (hexValues) {
            // Get entered hex values as an array
            let hexArray = hexStringsToArray(hexValues);

            // Sort values in rainbow order
            hexArray = rainbowSort(hexArray);

            /**
             * Discover Names for each hex
             *
             * @param   string  hexColor  Entered Hex Color
             *
             * @return  array    array('name', '#entered_hex' );
             */
            hexArray = hexArray.map(hexColor => {

                const colorMatchArr = ntc.name(hexColor); // array('#closest_hex', 'name', bool );

                // Format Color
                const colorMatchName = convertToSlug(colorMatchArr[1]);

                const arr = [colorMatchName, hexColor];

                return arr;
            });

            // Find duplicate names and add number to the name. ie red-1, red-2
            const colorMap = {};
            const count = hexArray.map(val => {
                return colorMap[val[0]] = (typeof colorMap[val[0]] === "undefined") ? 1 : colorMap[val[0]] + 1;
            });

            hexArray.forEach((color, index) => {
                const name = colorMap[color[0]] === 1 ? color[0] : color[0] + '-' + count[index];
                color[0] = name;
            });

            /**
             * Add Prefix
             */
            if (varPrefix.value) {
                const prefix = varPrefix.value;
                hexArray.forEach(color => {
                    color[0] = `${prefix}-${color[0]}`;
                });
            }

            /**
             * Convert color name to variable name
             */
            const language = selectedLanguage.value;
            hexArray.forEach(color => {
                color[0] = symbols[language] + color[0];
            });

            // Convert to RGB
            if (convertToRGB.checked === true) {
                hexArray.forEach(color => {
                    color[1] = hexToRGB(color[1]);
                });
            }

            // Add RGB Varient
            if (addRGBVarient.checked === true) {
                /**
                 * Convert color into a multidimensional array
                 * Append -rgb to name and add rgb value.
                 */
                hexArray = hexArray.map(color => {
                    const rgbArr = [color[0] + '-rgb', hexToRGB(color[1])];
                    color = [color, rgbArr];

                    return color;
                });
            }

            console.log('hexArray', hexArray);

            hexOutput.value = hexArray.toString();
        }
    });

}

export default Processor;