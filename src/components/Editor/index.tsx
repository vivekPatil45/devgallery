import React, { useEffect, useRef, useState } from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    ContentBlock,
} from "draft-js";
import Toolbar from "./Toolbar";

type RichTextEditorProps = {
    description: EditorState;
    setDescription: (editorState: EditorState) => void;
};
const DraftEditor = ({ description, setDescription }: RichTextEditorProps) => {
    
    // description =  EditorState.createWithContent(
    //     convertFromRaw({
    //       blocks: [
    //         {
    //           key: "intro",
    //           text: "A Text-editor with super cool features built in Draft.js.",
    //           type: "unstyled",
    //           inlineStyleRanges: [
    //             { offset: 19, length: 6, style: "BOLD" },
    //             { offset: 25, length: 5, style: "ITALIC" },
    //             { offset: 30, length: 8, style: "UNDERLINE" },
    //           ],
    //           entityRanges: [],
    //           data: {},
    //         },
    //         {
    //           key: "title",
    //           text: "Tell us a story!",
    //           type: "header-one",
    //           inlineStyleRanges: [],
    //           entityRanges: [],
    //           data: {},
    //         },
    //       ],
    //       entityMap: {},
    //     })
    // )

    //   const [editorState, setEditorState] = useState(() =>
//     EditorState.createWithContent(
//       convertFromRaw({
//         blocks: [
//           {
//             key: "intro",
//             text: "A Text-editor with super cool features built in Draft.js.",
//             type: "unstyled",
//             inlineStyleRanges: [
//               { offset: 19, length: 6, style: "BOLD" },
//               { offset: 25, length: 5, style: "ITALIC" },
//               { offset: 30, length: 8, style: "UNDERLINE" },
//             ],
//             entityRanges: [],
//             data: {},
//           },
//           {
//             key: "title",
//             text: "Tell us a story!",
//             type: "header-one",
//             inlineStyleRanges: [],
//             entityRanges: [],
//             data: {},
//           },
//         ],
//         entityMap: {},
//       })
//     )
//   );

    const editor = useRef<Editor>(null);

    useEffect(() => {
        editor.current?.focus();
    }, []);

    const handleKeyCommand = (command: string): boolean => {
        const newState = RichUtils.handleKeyCommand(description, command);
        if (newState) {
            setDescription(newState);
        return true;
        }
        return false;
    };

    const styleMap = {
        CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
        },
        HIGHLIGHT: {
        backgroundColor: "#F7A5F7",
        },
        UPPERCASE: {
        textTransform: "uppercase",
        },
        LOWERCASE: {
        textTransform: "lowercase",
        },
        CODEBLOCK: {
        fontFamily: '"Fira Code", monospace',
        fontSize: "inherit",
        background: "#ffeff0",
        fontStyle: "italic",
        padding: "0.3rem 0.5rem",
        borderRadius: "0.2rem",
        },
        SUPERSCRIPT: {
        verticalAlign: "super",
        fontSize: "80%",
        },
        SUBSCRIPT: {
        verticalAlign: "sub",
        fontSize: "80%",
        },
    };

    const myBlockStyleFn = (block: ContentBlock) => {
        const type = block.getType();
        switch (type) {
        case "blockQuote":
            return "border-l-4 border-base-content/50 pl-4 italic text-base-content/70";
        case "leftAlign":
            return "text-left";
        case "rightAlign":
            return "text-right";
        case "centerAlign":
            return "text-center";
        case "justifyAlign":
            return "text-justify";
        default:
            return "";
        }
    };

    return (
        <div
            className="max-w-3xl mx-auto p-4 bg-base-300  shadow-xl rounded-xl"
            onClick={() => editor.current?.focus()}
        >
            <Toolbar description={description} setDescription={setDescription} />
            <div className=" bg-base-100 p-4 rounded-md min-h-[200px]">
                <Editor
                    ref={editor}
                    placeholder="Write something awesome..."
                    handleKeyCommand={handleKeyCommand}
                    editorState={description}
                    customStyleMap={styleMap}
                    blockStyleFn={myBlockStyleFn}
                    onChange={(newState) => {
                        setDescription(newState);
                        const content = newState.getCurrentContent();
                        // console.log("Raw Content:", convertToRaw(content));
                    }}
                />
            </div>
        </div>
    );
};

export default DraftEditor;
