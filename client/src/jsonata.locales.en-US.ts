const jsonataLocaleEnUs : Record<string, {args: string, desc: string}> = {
    "$string": {
        "args": "arg[, prettify]",
        "desc": "Casts the `arg` parameter to a string using the following casting rules:\n\n - Strings are unchanged\n - Functions are converted to an empty string\n - Numeric infinity and NaN throw an error because they cannot be represented as a JSON number\n - All other values are converted to a JSON string using the `JSON.stringify` function. If `prettify` is true, then \"prettified\" JSON is produced. i.e One line per field and lines will be indented based on the field depth."
    },
    "$length": {
        "args": "str",
        "desc": "Returns the number of characters in the string `str`. An error is thrown if `str` is not a string."
    },
    "$substring": {
        "args": "str, start[, length]",
        "desc": "Returns a string containing the characters in the first parameter `str` starting at position `start` (zero-offset). If `length` is specified, then the substring will contain maximum `length` characters. If `start` is negative then it indicates the number of characters from the end of `str`."
    },
    "$substringBefore": {
        "args": "str, chars",
        "desc": "Returns the substring before the first occurrence of the character sequence `chars` in `str`. If `str` does not contain `chars`, then it returns `str`."
    },
    "$substringAfter": {
        "args": "str, chars",
        "desc": "Returns the substring after the first occurrence of the character sequence `chars` in `str`. If `str` does not contain `chars`, then it returns `str`."
    },
    "$uppercase": {
        "args": "str",
        "desc": "Returns a string with all the characters of `str` converted to uppercase."
    },
    "$lowercase": {
        "args": "str",
        "desc": "Returns a string with all the characters of `str` converted to lowercase."
    },
    "$trim": {
        "args": "str",
        "desc": "Normalizes and trims all whitespace characters in `str` by applying the following steps:\n\n - All tabs, carriage returns, and line feeds are replaced with spaces.\n- Contiguous sequences of spaces are reduced to a single space.\n- Trailing and leading spaces are removed.\n\n If `str` is not specified (i.e. this function is invoked with no arguments), then the context value is used as the value of `str`. An error is thrown if `str` is not a string."
    },
    "$contains": {
        "args": "str, pattern",
        "desc": "Returns `true` if `str` is matched by `pattern`, otherwise it returns `false`. If `str` is not specified (i.e. this function is invoked with one argument), then the context value is used as the value of `str`. The `pattern` parameter can either be a string or a regular expression."
    },
    "$split": {
        "args": "str[, separator][, limit]",
        "desc": "Splits the `str` parameter into an array of substrings. It is an error if `str` is not a string. The optional `separator` parameter specifies the characters within the `str` about which it should be split as either a string or regular expression. If `separator` is not specified, then the empty string is assumed, and `str` will be split into an array of single characters. It is an error if `separator` is not a string. The optional `limit` parameter is a number that specifies the maximum number of substrings to include in the resultant array. Any additional substrings are discarded. If `limit` is not specified, then `str` is fully split with no limit to the size of the resultant array. It is an error if `limit` is not a non-negative number."
    },
    "$join": {
        "args": "array[, separator]",
        "desc": "Joins an array of component strings into a single concatenated string with each component string separated by the optional `separator` parameter. It is an error if the input `array` contains an item which isn't a string. If `separator` is not specified, then it is assumed to be the empty string, i.e. no `separator` between the component strings. It is an error if `separator` is not a string."
    },
    "$match": {
        "args": "str, pattern [, limit]",
        "desc": "Applies the `str` string to the `pattern` regular expression and returns an array of objects, with each object containing information about each occurrence of a match within `str`."
    },
    "$replace": {
        "args": "str, pattern, replacement [, limit]",
        "desc": "Finds occurrences of `pattern` within `str` and replaces them with `replacement`.\n\nThe optional `limit` parameter is the maximum number of replacements."
    },
    "$now": {
        "args": "$[picture [, timezone]]",
        "desc": "Generates a timestamp in ISO 8601 compatible format and returns it as a string. If the optional `picture` and `timezone` parameters are supplied, then the current timestamp is formatted as described by the `$fromMillis()` function"
    },
    "$base64encode": {
        "args": "string",
        "desc": "Converts an ASCII string to a base 64 representation. Each character in the string is treated as a byte of binary data. This requires that all characters in the string are in the 0x00 to 0xFF range, which includes all characters in URI encoded strings. Unicode characters outside of that range are not supported."
    },
    "$base64decode": {
        "args": "string",
        "desc": "Converts base 64 encoded bytes to a string, using a UTF-8 Unicode codepage."
    },
    "$number": {
        "args": "arg",
        "desc": "Casts the `arg` parameter to a number using the following casting rules:\n\n - Numbers are unchanged\n - Strings that contain a sequence of characters that represent a legal JSON number are converted to that number\n - All other values cause an error to be thrown."
    },
    "$abs": {
        "args": "number",
        "desc": "Returns the absolute value of the `number` parameter."
    },
    "$floor": {
        "args": "number",
        "desc": "Returns the value of `number` rounded down to the nearest integer that is smaller or equal to `number`."
    },
    "$ceil": {
        "args": "number",
        "desc": "Returns the value of `number` rounded up to the nearest integer that is greater than or equal to `number`."
    },
    "$round": {
        "args": "number [, precision]",
        "desc": "Returns the value of the `number` parameter rounded to the number of decimal places specified by the optional `precision` parameter."
    },
    "$power": {
        "args": "base, exponent",
        "desc": "Returns the value of `base` raised to the power of `exponent`."
    },
    "$sqrt": {
        "args": "number",
        "desc": "Returns the square root of the value of the `number` parameter."
    },
    "$random": {
        "args": "",
        "desc": "Returns a pseudo random number greater than or equal to zero and less than one."
    },
    "$millis": {
        "args": "",
        "desc": "Returns the number of milliseconds since the Unix Epoch (1 January, 1970 UTC) as a number. All invocations of `$millis()` within an evaluation of an expression will all return the same value."
    },
    "$sum": {
        "args": "array",
        "desc": "Returns the arithmetic sum of an `array` of numbers. It is an error if the input `array` contains an item which isn't a number."
    },
    "$max": {
        "args": "array",
        "desc": "Returns the maximum number in an `array` of numbers. It is an error if the input `array` contains an item which isn't a number."
    },
    "$min": {
        "args": "array",
        "desc": "Returns the minimum number in an `array` of numbers. It is an error if the input `array` contains an item which isn't a number."
    },
    "$average": {
        "args": "array",
        "desc": "Returns the mean value of an `array` of numbers. It is an error if the input `array` contains an item which isn't a number."
    },
    "$boolean": {
        "args": "arg",
        "desc": "Casts the argument to a Boolean using the following rules:\n\n - `Boolean` : unchanged\n - `string`: empty : `false`\n - `string`: non-empty : `true`\n - `number`: `0` : `false`\n - `number`: non-zero : `true`\n - `null` : `false`\n - `array`: empty : `false`\n - `array`: contains a member that casts to `true` : `true`\n - `array`: all members cast to `false` : `false`\n - `object`: empty : `false`\n - `object`: non-empty : `true`\n - `function` : `false`"
    },
    "$not": {
        "args": "arg",
        "desc": "Returns Boolean NOT on the argument. `arg` is first cast to a boolean"
    },
    "$exists": {
        "args": "arg",
        "desc": "Returns Boolean `true` if the `arg` expression evaluates to a value, or `false` if the expression does not match anything (e.g. a path to a non-existent field reference)."
    },
    "$count": {
        "args": "array",
        "desc": "Returns the number of items in the array"
    },
    "$append": {
        "args": "array, array",
        "desc": "Appends two arrays"
    },
    "$sort": {
        "args": "array [, function]",
        "desc": "Returns an array containing all the values in the `array` parameter, but sorted into order.\n\nIf a comparator `function` is supplied, then it must be a function that takes two parameters:\n\n`function(left, right)`\n\nThis function gets invoked by the sorting algorithm to compare two values `left` and `right`. If the value of `left` should be placed after the value of `right` in the desired sort order, then the function must return Boolean `true` to indicate a swap. Otherwise it must return `false`."
    },
    "$reverse": {
        "args": "array",
        "desc": "Returns an array containing all the values from the `array` parameter, but in reverse order."
    },
    "$shuffle": {
        "args": "array",
        "desc": "Returns an array containing all the values from the `array` parameter, but shuffled into random order."
    },
    "$zip": {
        "args": "array, ...",
        "desc": "Returns a convolved (zipped) array containing grouped arrays of values from the `array1` … `arrayN` arguments from index 0, 1, 2...."
    },
    "$keys": {
        "args": "object",
        "desc": "Returns an array containing the keys in the object. If the argument is an array of objects, then the array returned contains a de-duplicated list of all the keys in all of the objects."
    },
    "$lookup": {
        "args": "object, key",
        "desc": "Returns the value associated with key in object. If the first argument is an array of objects, then all of the objects in the array are searched, and the values associated with all occurrences of key are returned."
    },
    "$spread": {
        "args": "object",
        "desc": "Splits an object containing key/value pairs into an array of objects, each of which has a single key/value pair from the input object. If the parameter is an array of objects, then the resultant array contains an object for every key/value pair in every object in the supplied array."
    },
    "$merge": {
        "args": "array&lt;object&gt;",
        "desc": "Merges an array of `objects` into a single `object` containing all the key/value pairs from each of the objects in the input array. If any of the input objects contain the same key, then the returned `object` will contain the value of the last one in the array. It is an error if the input array contains an item that is not an object."
    },
    "$sift": {
        "args": "object, function",
        "desc": "Returns an object that contains only the key/value pairs from the `object` parameter that satisfy the predicate `function` passed in as the second parameter.\n\nThe `function` that is supplied as the second parameter must have the following signature:\n\n`function(value [, key [, object]])`"
    },
    "$each": {
        "args": "object, function",
        "desc": "Returns an array containing the values return by the `function` when applied to each key/value pair in the `object`."
    },
    "$map": {
        "args": "array, function",
        "desc": "Returns an array containing the results of applying the `function` parameter to each value in the `array` parameter.\n\nThe `function` that is supplied as the second parameter must have the following signature:\n\n`function(value [, index [, array]])`"
    },
    "$filter": {
        "args": "array, function",
        "desc": "Returns an array containing only the values in the `array` parameter that satisfy the `function` predicate.\n\nThe `function` that is supplied as the second parameter must have the following signature:\n\n`function(value [, index [, array]])`"
    },
    "$reduce": {
        "args": "array, function [, init]",
        "desc": "Returns an aggregated value derived from applying the `function` parameter successively to each value in `array` in combination with the result of the previous application of the function.\n\nThe function must accept two arguments, and behaves like an infix operator between each value within the `array`. The signature of `function` must be of the form: `myfunc($accumulator, $value[, $index[, $array]])`\n\nThe optional `init` parameter is used as the initial value in the aggregation."
    },
    "$flowContext": {
        "args": "string[, string]",
        "desc": "Retrieves a flow context property.\n\nThis is a Node-RED defined function."
    },
    "$globalContext": {
        "args": "string[, string]",
        "desc": "Retrieves a global context property.\n\nThis is a Node-RED defined function."
    },
    "$pad": {
        "args": "string, width [, char]",
        "desc": "Returns a copy of the `string` with extra padding, if necessary, so that its total number of characters is at least the absolute value of the `width` parameter.\n\nIf `width` is a positive number, then the string is padded to the right; if negative, it is padded to the left.\n\nThe optional `char` argument specifies the padding character(s) to use. If not specified, it defaults to the space character."
    },
    "$fromMillis": {
        "args": "number, [, picture [, timezone]]",
        "desc": "Convert the `number` representing milliseconds since the Unix Epoch (1 January, 1970 UTC) to a formatted string representation of the timestamp as specified by the picture string.\n\nIf the optional `picture` parameter is omitted, then the timestamp is formatted in the ISO 8601 format.\n\nIf the optional `picture` string is supplied, then the timestamp is formatted according to the representation specified in that string. The behaviour of this function is consistent with the two-argument version of the XPath/XQuery function `format-dateTime` as defined in the XPath F&O 3.1 specification. The picture string parameter defines how the timestamp is formatted and has the same syntax as `format-dateTime`.\n\nIf the optional `timezone` string is supplied, then the formatted timestamp will be in that timezone. The `timezone` string should be in the format '±HHMM', where ± is either the plus or minus sign and HHMM is the offset in hours and minutes from UTC. Positive offset for timezones east of UTC, negative offset for timezones west of UTC."
    },
    "$formatNumber": {
        "args": "number, picture [, options]",
        "desc": "Casts the `number` to a string and formats it to a decimal representation as specified by the `picture` string.\n\n The behaviour of this function is consistent with the XPath/XQuery function `fn:format-number` as defined in the XPath F&O 3.1 specification. The `picture` string parameter defines how the number is formatted and has the same syntax as `fn:format-number`.\n\nThe optional third argument `options` is used to override the default locale specific formatting characters such as the decimal separator. If supplied, this argument must be an object containing name/value pairs specified in the decimal format section of the XPath F&O 3.1 specification."
    },
    "$formatBase": {
        "args": "number [, radix]",
        "desc": "Casts the `number` to a string and formats it to an integer represented in the number base specified by the `radix` argument. If `radix` is not specified, then it defaults to base 10. `radix` can be between 2 and 36, otherwise an error is thrown."
    },
    "$toMillis": {
        "args": "timestamp",
        "desc": "Convert a `timestamp` string in the ISO 8601 format to the number of milliseconds since the Unix Epoch (1 January, 1970 UTC) as a number. An error is thrown if the string is not in the correct format."
    },
    "$env": {
        "args": "arg",
        "desc": "Returns the value of an environment variable.\n\nThis is a Node-RED defined function."
    },
    "$eval": {
        "args": "expr [, context]",
        "desc": "Parses and evaluates the string `expr` which contains literal JSON or a JSONata expression using the current context as the context for evaluation."
    },
    "$formatInteger": {
        "args": "number, picture",
        "desc": "Casts the `number` to a string and formats it to an integer representation as specified by the `picture` string. The picture string parameter defines how the number is formatted and has the same syntax as `fn:format-integer` from the XPath F&O 3.1 specification."
    },
    "$parseInteger": {
        "args": "string, picture",
        "desc": "Parses the contents of the `string` parameter to an integer (as a JSON number) using the format specified by the `picture` string. The `picture` string parameter has the same format as `$formatInteger`."
    },
    "$error": {
        "args": "[str]",
        "desc": "Throws an error with a message. The optional `str` will replace the default message of `$error() function evaluated`"
    },
    "$assert": {
        "args": "arg, str",
        "desc": "If `arg` is `true` the function returns `undefined`. If `arg` is `false` an exception is thrown with `str` as the message of the exception."
    },
    "$single": {
        "args": "array, function",
        "desc": "Returns the one and only value in the `array` parameter that satisfies the `function` predicate (i.e. the `function` returns Boolean `true` when passed the value). Throws an exception if the number of matching values is not exactly one.\n\nThe function should be supplied in the following signature: `function(value [, index [, array]])` where value is each input of the array, index is the position of that value and the whole array is passed as the third argument"
    },
    "$encodeUrlComponent": {
        "args": "str",
        "desc": "Encodes a Uniform Resource Locator (URL) component by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character.\n\nExample: `$encodeUrlComponent(\"?x=test\")` => `\"%3Fx%3Dtest\"`"
    },
    "$encodeUrl": {
        "args": "str",
        "desc": "Encodes a Uniform Resource Locator (URL) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character.\n\nExample: `$encodeUrl(\"https://mozilla.org/?x=шеллы\")` => `\"https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B\"`"
    },
    "$decodeUrlComponent": {
        "args": "str",
        "desc": "Decodes a Uniform Resource Locator (URL) component previously created by encodeUrlComponent.\n\nExample: `$decodeUrlComponent(\"%3Fx%3Dtest\")` => `\"?x=test\"`"
    },
    "$decodeUrl": {
        "args": "str",
        "desc": "Decodes a Uniform Resource Locator (URL) previously created by encodeUrl.\n\nExample: `$decodeUrl(\"https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B\")` => `\"https://mozilla.org/?x=шеллы\"`"
    },
    "$distinct": {
        "args": "array",
        "desc": "Returns an array with duplicate values removed from `array`"
    },
    "$type": {
        "args": "value",
        "desc": "Returns the type of `value` as a string. If `value` is undefined, this will return `undefined`"
    },
    "$moment": {
        "args": "[str]",
        "desc": "Gets a date object using the Moment library."
    },
    "$clone": {
        "args": "value",
        "desc": "Safely clone an object."
    }
}

export default jsonataLocaleEnUs;