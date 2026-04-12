const fs = require('fs');
const path = 'src/constants/index.ts';
let content = fs.readFileSync(path, 'utf8');

// Use regex to locate whyChooseData and replace subtitle
const regex = /export const whyChooseData = \{[\s\S]*?subtitle: \{[\s\S]*?\},/m;
const match = content.match(regex);

if (match) {
    const original = match[0];
    const updated = original.replace(/subtitle: \{[\s\S]*?\}/m, `subtitle: { 
        bn: "", 
        en: "" 
    }`);
    content = content.replace(original, updated);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully cleared WhyChooseUs subtitle in index.ts");
} else {
    console.log("Could not find whyChooseData subtitle block");
}
