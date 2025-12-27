/**
 * Crisis Detection Logic
 * Scans user input for keywords related to self-harm, suicide, or extreme distress.
 */

const crisisKeywords = [
    'kill myself',
    'hurt myself',
    'suicide',
    'want to die',
    'end my life',
    'no reason to live',
    'want to disappear',
    'cutting myself',
    'overdose',
    'end it all',
    'don\'t want to exist',
    'better off dead',
    'hopeless',
    'worthless'
];

// Regex for more complex patterns
const crisisRegex = /(kill|hurt|end|take).{0,10}(life|myself|it all)|(want to|going to).{0,10}(die|disappear)/i;

const isCrisis = (message) => {
    if (!message) return false;
    const lowerMsg = message.toLowerCase();

    // 1. Check Keywords
    const hasKeyword = crisisKeywords.some(keyword => lowerMsg.includes(keyword));

    // 2. Check Regex
    const hasRegexMatch = crisisRegex.test(lowerMsg);

    return hasKeyword || hasRegexMatch;
};

module.exports = { isCrisis };
