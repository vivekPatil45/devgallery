import React from "react";
import { EditorState, RichUtils } from "draft-js";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaHighlighter,
    FaStrikethrough,
    FaSuperscript,
    FaSubscript,
    FaCode,
    FaQuoteRight,
    FaListUl,
    FaListOl,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaTextWidth,
    FaChevronUp,
    FaChevronDown,
} from "react-icons/fa";

type Tool = {
    label: string;
    style: string;
    method: "inline" | "block";
    icon?: JSX.Element;
};

type ToolbarProps = {
    description: EditorState;
    setDescription: (editorState: EditorState) => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ description, setDescription }) => {
    const tools: Tool[] = [
        { label: "bold", style: "BOLD", icon: <FaBold />, method: "inline" },
        { label: "italic", style: "ITALIC", icon: <FaItalic />, method: "inline" },
        { label: "underline", style: "UNDERLINE", icon: <FaUnderline />, method: "inline" },
        { label: "highlight", style: "HIGHLIGHT", icon: <FaHighlighter />, method: "inline" },
        { label: "strike-through", style: "STRIKETHROUGH", icon: <FaStrikethrough />, method: "inline" },
        { label: "Superscript", style: "SUPERSCRIPT", icon: <FaSuperscript />, method: "inline" },
        { label: "Subscript", style: "SUBSCRIPT", icon: <FaSubscript />, method: "inline" },
        { label: "Monospace", style: "CODE", icon: <FaTextWidth />, method: "inline" },
        { label: "Code Block", style: "CODEBLOCK", icon: <FaCode />, method: "inline" },
        { label: "Uppercase", style: "UPPERCASE", icon: <FaChevronUp />, method: "inline" },
        { label: "Lowercase", style: "LOWERCASE", icon: <FaChevronDown />, method: "inline" },
        { label: "Blockquote", style: "blockQuote", icon: <FaQuoteRight />, method: "block" },
        { label: "Unordered List", style: "unordered-list-item", icon: <FaListUl />, method: "block" },
        { label: "Ordered List", style: "ordered-list-item", icon: <FaListOl />, method: "block" },
        { label: "Left", style: "leftAlign", icon: <FaAlignLeft />, method: "block" },
        { label: "Center", style: "centerAlign", icon: <FaAlignCenter />, method: "block" },
        { label: "Right", style: "rightAlign", icon: <FaAlignRight />, method: "block" },
        { label: "H1", style: "header-one", method: "block" },
        { label: "H2", style: "header-two", method: "block" },
        { label: "H3", style: "header-three", method: "block" },
        { label: "H4", style: "header-four", method: "block" },
        { label: "H5", style: "header-five", method: "block" },
        { label: "H6", style: "header-six", method: "block" },
    ];

    const applyStyle = (e: React.MouseEvent, style: string, method: string) => {
        e.preventDefault();
        const newState =
        method === "block"
            ? RichUtils.toggleBlockType(description, style)
            : RichUtils.toggleInlineStyle(description, style);
            setDescription(newState);
    };

    const isActive = (style: string, method: string) => {
        if (method === "block") {
        const selection = description.getSelection();
        const blockType = description
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
        return blockType === style;
        } else {
        const currentStyle = description.getCurrentInlineStyle();
        return currentStyle.has(style);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-base-200 rounded-lg shadow">
            {tools.map((item, idx) => (
                <button
                key={idx}
                title={item.label}
                onClick={(e) => applyStyle(e, item.style, item.method)}
                onMouseDown={(e) => e.preventDefault()}
                className={`btn btn-sm btn-square ${
                    isActive(item.style, item.method)
                    ? "btn-primary text-white"
                    : "btn-ghost text-base-content/50 hover:text-base-content"
                }`}
                >
                {item.icon || item.label}
                </button>
            ))}
        </div>
    );
};

export default Toolbar;
