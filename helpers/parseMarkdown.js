import { getChatTypeByGuid } from "../tools";
const parseMarkdown = text => {
    if (!text) {
        return [[], ""];
    }
    const patterns = {
        Mono: /\`\`([^``]*)\`\`/,
        Bold: /\*\*([^**]*)\*\*/,
        Italic: /\_\_([^__]*)\_\_/,
        Strike: /\~\~([^~~]*)\~\~/,
        Underline: /\-\-([^__]*)\-\-/,
        Mention: /\@\@([^@@]*)\@\@/,
        Spoiler: /\#\#([^##]*)\#\#/
    };
    const metadata = [];
    let conflict = 0;
    let mentionObjectIndex = 0;
    const result = [];
    for (const [style, pattern] of Object.entries(patterns)) {
        const regex = new RegExp(pattern, "g");
        let match;
        while ((match = regex.exec(text)) !== null) {
            metadata.push([match.index, match[1].length, style]);
        }
    }
    metadata.sort((a, b) => Number(a[0]) - Number(b[0]));
    for (const [start, length, style] of metadata) {
        if (style !== "Mention") {
            result.push({
                type: style,
                from_index: Number(start) - Number(conflict),
                length: length
            });
            conflict += 4;
        } else {
            const mentionObjects = text.match(/\@\(([^(]*)\)/g);
            const mentionObject = mentionObjects[mentionObjectIndex].slice(
                2,
                -1
            );
            const mentionType = getChatTypeByGuid(mentionObject) || "Link";
            if (mentionType === "Link") {
                result.push({
                    from_index: Number(start) - Number(conflict),
                    length: length,
                    link: {
                        hyperlink_data: {
                            url: mentionObject
                        },
                        type: "hyperlink"
                    },
                    type: mentionType
                });
            } else {
                result.push({
                    type: "MentionText",
                    from_index: Number(start) - Number(conflict),
                    length: length,
                    mention_text_object_guid: mentionObject,
                    mention_text_object_type: mentionType
                });
            }
            const mentionLength = mentionObjects[mentionObjectIndex].length;
            text = text.replace(`(${mentionObject})`, "");
            conflict += 6 + mentionLength;
            mentionObjectIndex += 1;
        }
    }
    let real_text = text
        .split("**")
        .join("")
        .split("__")
        .join("")
        .split("~~")
        .join("")
        .split("--")
        .join("")
        .split("@@")
        .join("")
        .split("##")
        .join("")
        .split("``")
        .join("");
    return [result, real_text];
};
export default parseMarkdown;
