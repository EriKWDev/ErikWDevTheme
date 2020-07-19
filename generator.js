const chroma = require("chroma-js")
const fs = require("fs")
const path = require("path")
const os = require("os")

class Color {
    constructor(base, color) {
        this.base = base
        this.color = color
    }

    rgb() {
        return this.color.rgb()
    }

    rgba() {
        return this.color.rgba()
    }

    hex() {
        const alpha = this.color.alpha()
        return this.alpha(1).fade(1 - alpha).color.hex()
    }

    alpha(value) {
        return new Color(this.base, this.color.alpha(value))
    }

    fade(value) {
        return new Color(this.base, chroma.mix(this.base, this.color, 1 - value))
    }

    darken(value) {
        return new Color(this.base, this.color.darken(value))
    }

    brighten(value) {
        return new Color(this.base, this.color.brighten(value))
    }
}

function color(hexBase) {
    return (hexColor) => {
        return new Color(chroma(hexBase), chroma(hexColor))
    }
}

const background = "#20223A"

const _ = new color(background)

const common = {
    accent: _("#FC4E8C"),
    bg: _(background),
    fg: _("#CBCCC6"),
    ui: _("#707A8C"),
}

const syntax = {
    tag: _("#5CCFE6"),
    func: _("#EEBE44"),
    entity: _("#73D0FF"),
    string: _("#67C988"),
    regexp: _("#95E6CB"),
    markup: _("#AA7CE3"),
    keyword: _("#F6754F"),
    special: _("#FFE6B3"),
    comment: _("#5C6773"),
    constant: _("#BFFFF7"),
    operator: _("#F29E74"),
    error: _("#FF3049"),
}

const vcs = {
    added: _("#A6CC70"),
    modified: _("#77A8D9"),
    removed: _("#F27983"),
}

const ui = {
    line: common.bg.darken(.15),
    panel: {
        bg: common.bg.brighten(.1),
        shadow: common.bg.darken(.3),
        border: common.bg.darken(.4)
    },
    gutter: {
        normal: common.ui.alpha(.4),
        active: common.ui.alpha(.8)
    },
    selection: {
        bg: _("#7399E6").fade(.87),
        inactive: _("#96B0E6").fade(.93),
        border: _("#96B0E6").fade(.93)
    },
    guide: {
        active: common.ui.alpha(.7),
        normal: common.ui.alpha(.3)
    }
}

const COLORS = {
    common: common,
    syntax: syntax,
    vcs: vcs,
    ui: ui
}

const TERMINAL_COLORS = {
    dark: {
        black: COLORS.ui.line.hex(),
        white: "#c7c7c7",
        brightBlack: "#686868",
        brightWhite: "#ffffff"
    }
}

const BORDERED = false
const VARIANT = "dark"

function getTheme() {
    return {
        "type": "dark",
        "colors": {
            // Colour reference https://code.visualstudio.com/docs/getstarted/theme-color-reference

            // BASE COLOURS
            "focusBorder": COLORS.common.ui.fade(.4).hex(),
            "foreground": COLORS.common.ui.hex(),
            "widget.shadow": COLORS.ui.panel.shadow.hex(),
            "selection.background": COLORS.ui.selection.bg.alpha(0.992).hex(),
            "icon.foreground": COLORS.common.ui.hex(),
            "errorForeground": COLORS.syntax.error.hex(),
            "descriptionForeground": COLORS.common.ui.hex(),

            // TEXT COLOURS
            "textBlockQuote.background": COLORS.ui.panel.bg.hex(),
            "textLink.foreground": COLORS.common.accent.hex(),
            "textLink.activeForeground": COLORS.common.accent.hex(),
            "textPreformat.foreground": COLORS.common.fg.hex(),

            // BUTTON CONTROL
            "button.background": COLORS.common.accent.hex(),
            "button.foreground": COLORS.common.bg.fade(.5).hex(),
            "button.hoverBackground": COLORS.common.accent.darken(.1).hex(),

            // DROPDOWN CONTROL
            "dropdown.background": COLORS.ui.panel.bg.hex(),
            "dropdown.foreground": COLORS.common.ui.hex(),
            "dropdown.border": COLORS.common.ui.fade(.7).hex(),

            // INPUT CONTROL
            "input.background": COLORS.ui.panel.bg.darken(.15).hex(),
            "input.border": COLORS.common.ui.fade(.7).hex(),
            "input.foreground": COLORS.common.fg.hex(),
            "input.placeholderForeground": COLORS.common.ui.fade(.3).hex(),
            "inputOption.activeBorder": COLORS.common.accent.hex(),
            "inputValidation.errorBackground": COLORS.common.bg.hex(),
            "inputValidation.errorBorder": COLORS.syntax.error.hex(),
            "inputValidation.infoBackground": COLORS.common.bg.hex(),
            "inputValidation.infoBorder": COLORS.syntax.tag.hex(),
            "inputValidation.warningBackground": COLORS.common.bg.hex(),
            "inputValidation.warningBorder": COLORS.syntax.func.hex(),

            // SCROLLBAR CONTROL
            "scrollbar.shadow": COLORS.ui.line.hex(),
            "scrollbarSlider.background": COLORS.common.ui.alpha(.4).hex(),
            "scrollbarSlider.hoverBackground": COLORS.common.ui.alpha(.6).hex(),
            "scrollbarSlider.activeBackground": COLORS.common.ui.alpha(.7).hex(),

            // BADGE
            "badge.background": COLORS.common.accent.alpha(0.2).hex(),
            "badge.foreground": COLORS.common.accent.hex(),

            // PROGRESS BAR
            "progressBar.background": COLORS.common.accent.hex(),

            // LISTS AND TREES
            "list.activeSelectionBackground": COLORS.ui.line.hex(),
            "list.activeSelectionForeground": COLORS.common.ui.hex(),
            "list.focusBackground": COLORS.ui.line.hex(),
            "list.focusForeground": COLORS.common.ui.hex(),
            "list.highlightForeground": COLORS.common.accent.hex(),
            "list.hoverBackground": COLORS.ui.line.hex(),
            "list.hoverForeground": COLORS.common.ui.hex(),
            "list.inactiveSelectionBackground": COLORS.ui.line.hex(),
            "list.inactiveSelectionForeground": COLORS.common.ui.hex(),
            "list.invalidItemForeground": COLORS.common.ui.fade(.3).hex(),
            "list.errorForeground": COLORS.vcs.removed.hex(),
            "tree.indentGuidesStroke": COLORS.ui.guide.active.hex(),

            "listFilterWidget.background": COLORS.ui.panel.bg.hex(),
            "listFilterWidget.outline": COLORS.common.accent.hex(),
            "listFilterWidget.noMatchesOutline": COLORS.syntax.error.hex(),
            "list.filterMatchBorder": COLORS.common.accent.hex(),
            "list.filterMatchBackground": COLORS.common.accent.alpha(.05).hex(),

            // ACTIVITY BAR
            "activityBar.background": COLORS.common.bg.hex(),
            "activityBar.foreground": COLORS.common.ui.alpha(.8).hex(),
            "activityBar.inactiveForeground": COLORS.common.ui.alpha(.6).hex(),
            "activityBar.border": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),
            // "activityBar.activeBorder": COLORS.common.accent.alpha(.8).hex(),
            "activityBarBadge.background": COLORS.common.accent.hex(),
            "activityBarBadge.foreground": COLORS.common.bg.hex(),

            // SIDE BAR
            "sideBar.background": COLORS.common.bg.hex(),
            "sideBar.border": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),
            "sideBarTitle.foreground": COLORS.common.ui.hex(),
            "sideBarSectionHeader.background": COLORS.common.bg.hex(),
            "sideBarSectionHeader.foreground": COLORS.common.ui.hex(),
            "sideBarSectionHeader.border": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),

            // EDITOR GROUPS & TABS
            "editorGroup.border": COLORS.ui.line.hex(),
            "editorGroup.background": COLORS.ui.panel.bg.hex(),
            "editorGroupHeader.noTabsBackground": COLORS.common.bg.hex(),
            "editorGroupHeader.tabsBackground": COLORS.common.bg.hex(),
            "editorGroupHeader.tabsBorder": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),
            "tab.activeBackground": BORDERED ? COLORS.ui.panel.bg.hex() : COLORS.common.bg.hex(),
            "tab.activeForeground": COLORS.common.fg.hex(),
            "tab.border": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),
            "tab.activeBorder": BORDERED ? COLORS.ui.panel.bg.hex() : COLORS.common.accent.hex(),
            "tab.activeBorderTop": BORDERED ? COLORS.common.accent.hex() : undefined,
            "tab.unfocusedActiveBorder": BORDERED ? undefined : COLORS.common.ui.hex(),
            "tab.unfocusedActiveBorderTop": BORDERED ? COLORS.common.ui.hex() : undefined,
            "tab.inactiveBackground": COLORS.common.bg.hex(),
            "tab.inactiveForeground": COLORS.common.ui.hex(),
            "tab.unfocusedActiveForeground": COLORS.common.ui.hex(),
            "tab.unfocusedInactiveForeground": COLORS.common.ui.hex(),

            // EDITOR
            "editor.background": BORDERED ? COLORS.ui.panel.bg.hex() : COLORS.common.bg.hex(),
            "editor.foreground": COLORS.common.fg.hex(),
            "editorLineNumber.foreground": COLORS.ui.gutter.normal.hex(),
            "editorLineNumber.activeForeground": COLORS.ui.gutter.active.hex(),
            "editorCursor.foreground": COLORS.common.accent.hex(),

            "editor.selectionBackground": COLORS.ui.selection.bg.hex(),
            "editor.inactiveSelectionBackground": COLORS.ui.selection.inactive.hex(),
            "editor.selectionHighlightBackground": COLORS.ui.selection.inactive.hex(),
            "editor.selectionHighlightBorder": COLORS.ui.selection.border.hex(),

            "editor.wordHighlightBackground": COLORS.vcs.modified.alpha(.07).hex(),
            "editor.wordHighlightBorder": COLORS.vcs.modified.alpha(.5).hex(),
            "editor.wordHighlightStrongBackground": COLORS.vcs.added.alpha(.07).hex(),
            "editor.wordHighlightStrongBorder": COLORS.vcs.added.alpha(.5).hex(),

            "editor.findMatchBackground": COLORS.common.accent.alpha(.05).hex(),
            "editor.findMatchBorder": COLORS.common.accent.hex(),
            "editor.findMatchHighlightBackground": COLORS.common.accent.alpha(.05).hex(),
            "editor.findMatchHighlightBorder": COLORS.common.accent.alpha(.35).hex(),
            "editor.findRangeHighlightBackground": COLORS.ui.selection.inactive.hex(),
            "editor.findRangeHighlightBorder": `${COLORS.common.bg.hex()}00`,

            // "editor.hoverHighlightBackground": "",

            "editor.lineHighlightBackground": COLORS.ui.line.hex(),
            // "editor.lineHighlightBorder": "",

            "editorLink.activeForeground": COLORS.common.accent.hex(),

            "editor.rangeHighlightBackground": COLORS.ui.line.hex(),

            "editorWhitespace.foreground": COLORS.ui.gutter.normal.hex(),

            "editorIndentGuide.background": COLORS.ui.guide.normal.hex(),
            "editorIndentGuide.activeBackground": COLORS.ui.guide.active.hex(),

            "editorRuler.foreground": COLORS.ui.guide.normal.hex(),
            "editorCodeLens.foreground": COLORS.syntax.comment.hex(),

            "editorBracketMatch.background": COLORS.ui.gutter.normal.alpha(.3).hex(),
            "editorBracketMatch.border": COLORS.ui.gutter.active.alpha(.6).hex(),

            // OVERVIEW RULER
            "editorOverviewRuler.border": COLORS.ui.line.hex(),
            "editorOverviewRuler.modifiedForeground": COLORS.vcs.modified.alpha(.6).hex(),
            "editorOverviewRuler.addedForeground": COLORS.vcs.added.alpha(.6).hex(),
            "editorOverviewRuler.deletedForeground": COLORS.vcs.removed.alpha(.6).hex(),
            "editorOverviewRuler.errorForeground": COLORS.syntax.error.hex(),
            "editorOverviewRuler.warningForeground": COLORS.common.accent.hex(),

            // ERRORS AND WARNINGS
            "editorError.foreground": COLORS.syntax.error.hex(),
            "editorWarning.foreground": COLORS.common.accent.hex(),

            // GUTTER
            "editorGutter.modifiedBackground": COLORS.vcs.modified.alpha(.6).hex(),
            "editorGutter.addedBackground": COLORS.vcs.added.alpha(.6).hex(),
            "editorGutter.deletedBackground": COLORS.vcs.removed.alpha(.6).hex(),

            // DIFF EDITOR
            "diffEditor.insertedTextBackground": COLORS.syntax.string.alpha(.15).hex(),
            "diffEditor.removedTextBackground": COLORS.syntax.operator.alpha(.15).hex(),

            // EDITOR WIDGET
            "editorWidget.background": COLORS.ui.panel.bg.hex(),
            "editorSuggestWidget.background": COLORS.ui.panel.bg.hex(),
            "editorSuggestWidget.border": COLORS.ui.panel.border.hex(),
            "editorSuggestWidget.highlightForeground": COLORS.common.accent.hex(),
            "editorSuggestWidget.selectedBackground": COLORS.ui.line.hex(),
            "editorHoverWidget.background": COLORS.ui.panel.bg.hex(),
            "editorHoverWidget.border": COLORS.ui.panel.border.hex(),

            // DEBUG EXCEPTION
            "debugExceptionWidget.border": COLORS.ui.line.hex(),
            "debugExceptionWidget.background": COLORS.ui.panel.bg.hex(),

            // EDITOR MARKER
            "editorMarkerNavigation.background": COLORS.ui.panel.bg.hex(),

            // PEEK VIEW
            "peekView.border": COLORS.ui.line.hex(),
            "peekViewEditor.background": COLORS.ui.panel.bg.hex(),
            "peekViewEditor.matchHighlightBackground": COLORS.common.accent.alpha(.2).hex(),
            "peekViewResult.background": COLORS.ui.panel.bg.hex(),
            "peekViewResult.fileForeground": COLORS.common.ui.hex(),
            "peekViewResult.matchHighlightBackground": COLORS.common.accent.alpha(.2).hex(),
            "peekViewTitle.background": COLORS.ui.panel.bg.hex(),
            "peekViewTitleDescription.foreground": COLORS.common.ui.hex(),
            "peekViewTitleLabel.foreground": COLORS.common.ui.hex(),

            // Panel
            "panel.background": COLORS.common.bg.hex(),
            "panel.border": COLORS.ui.line.hex(),
            "panelTitle.activeBorder": COLORS.common.accent.hex(),
            "panelTitle.activeForeground": COLORS.common.fg.hex(),
            "panelTitle.inactiveForeground": COLORS.common.ui.hex(),

            // STATUS BAR
            "statusBar.background": COLORS.common.bg.hex(),
            "statusBar.foreground": COLORS.common.ui.hex(),
            "statusBar.border": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),
            "statusBar.debuggingBackground": COLORS.syntax.operator.hex(),
            "statusBar.debuggingForeground": COLORS.common.bg.fade(.5).hex(),
            "statusBar.noFolderBackground": COLORS.ui.panel.bg.hex(),
            "statusBarItem.activeBackground": COLORS.ui.line.hex(),
            "statusBarItem.hoverBackground": COLORS.ui.line.hex(),
            "statusBarItem.prominentBackground": COLORS.ui.line.hex(),
            "statusBarItem.prominentHoverBackground": "#00000030",

            // TITLE BAR
            "titleBar.activeBackground": COLORS.common.bg.hex(),
            "titleBar.activeForeground": COLORS.common.fg.hex(),
            "titleBar.inactiveBackground": COLORS.common.bg.hex(),
            "titleBar.inactiveForeground": COLORS.common.ui.hex(),
            "titleBar.border": BORDERED ? COLORS.ui.line.hex() : COLORS.common.bg.hex(),

            // EXTENSIONS
            "extensionButton.prominentForeground": COLORS.common.bg.fade(.5).hex(),
            "extensionButton.prominentBackground": COLORS.common.accent.hex(),
            "extensionButton.prominentHoverBackground": COLORS.common.accent.darken(.1).hex(),

            // QUICK PICKER
            "pickerGroup.border": COLORS.ui.line.hex(),
            "pickerGroup.foreground": COLORS.common.ui.fade(.5).hex(),

            // DEBUG
            "debugToolBar.background": COLORS.ui.panel.bg.hex(),
            // "debugToolBar.border": "",

            // WELCOME PAGE
            "walkThrough.embeddedEditorBackground": COLORS.ui.panel.bg.hex(),

            // GIT
            "gitDecoration.modifiedResourceForeground": COLORS.vcs.modified.alpha(.7).hex(),
            "gitDecoration.deletedResourceForeground": COLORS.vcs.removed.alpha(.7).hex(),
            "gitDecoration.untrackedResourceForeground": COLORS.vcs.added.alpha(.7).hex(),
            "gitDecoration.ignoredResourceForeground": COLORS.common.ui.fade(.5).hex(),
            "gitDecoration.conflictingResourceForeground": "",
            "gitDecoration.submoduleResourceForeground": COLORS.syntax.constant.alpha(.7).hex(),

            // Settings
            "settings.headerForeground": COLORS.common.fg.hex(),
            "settings.modifiedItemIndicator": COLORS.vcs.modified.hex(),

            // TERMINAL
            "terminal.background": COLORS.common.bg.hex(),
            "terminal.foreground": COLORS.common.fg.hex(),
            "terminal.ansiBlack": TERMINAL_COLORS[VARIANT].black,
            "terminal.ansiRed": COLORS.syntax.markup.darken(.1).hex(),
            "terminal.ansiGreen": COLORS.vcs.added.hex(),
            "terminal.ansiYellow": COLORS.syntax.func.darken(.1).hex(),
            "terminal.ansiBlue": COLORS.syntax.entity.darken(.1).hex(),
            "terminal.ansiMagenta": COLORS.syntax.constant.darken(.1).hex(),
            "terminal.ansiCyan": COLORS.syntax.regexp.darken(.1).hex(),
            "terminal.ansiWhite": TERMINAL_COLORS[VARIANT].white,
            "terminal.ansiBrightBlack": TERMINAL_COLORS[VARIANT].brightBlack,
            "terminal.ansiBrightRed": COLORS.syntax.markup.hex(),
            "terminal.ansiBrightGreen": COLORS.syntax.string.hex(),
            "terminal.ansiBrightYellow": COLORS.syntax.func.hex(),
            "terminal.ansiBrightBlue": COLORS.syntax.entity.hex(),
            "terminal.ansiBrightMagenta": COLORS.syntax.constant.hex(),
            "terminal.ansiBrightCyan": COLORS.syntax.regexp.hex(),
            "terminal.ansiBrightWhite": TERMINAL_COLORS[VARIANT].brightWhite
        },


        "tokenColors": [
            {
                "settings": {
                    "background": COLORS.common.bg.hex(),
                    "foreground": COLORS.common.fg.hex()
                }
            },
            {
                "name": "Comment",
                "scope": ["comment"],
                "settings": {
                    "fontStyle": "italic",
                    "foreground": COLORS.syntax.comment.hex()
                }
            },


            {
                "name": "String",
                "scope": ["string", "constant.other.symbol"], //+
                "settings": {
                    "foreground": COLORS.syntax.string.hex()
                }
            },
            {
                "name": "Regular Expressions and Escape Characters",
                "scope": ["string.regexp"],
                "settings": {
                    "foreground": COLORS.syntax.regexp.hex()
                }
            },
            {
                "name": "Regular Expressions and Escape Characters",
                "scope": ["constant.character", "constant.other"],
                "settings": {
                    "fontStyle": "bold",
                    "foreground": COLORS.syntax.constant.hex()
                }
            },


            {
                "name": "Number",
                "scope": ["constant.numeric"],
                "settings": {
                    "foreground": COLORS.common.accent.hex()
                }
            },
            {
                "name": "Built-in constants",
                "scope": ["constant.language"],
                "settings": {
                    "foreground": COLORS.common.accent.hex()
                }
            },


            {
                "name": "Variable",
                "scope": ["variable"],
                "settings": {
                    "foreground": COLORS.common.fg.hex()
                }
            },
            {
                "name": "Member Variable",
                "scope": ["variable.member"],
                "settings": {
                    "foreground": COLORS.syntax.markup.hex()
                }
            },
            {
                "name": "Language variable",
                "scope": ["variable.language"],
                "settings": {
                    "fontStyle": "italic",
                    "foreground": COLORS.syntax.tag.hex()
                }
            },


            // ------
            // Keywords
            {
                "name": "Storage",
                "scope": ["storage"],
                "settings": {
                    "foreground": COLORS.syntax.keyword.hex()
                }
            },
            {
                "name": "Keyword",
                "scope": ["keyword"],
                "settings": {
                    "foreground": COLORS.syntax.keyword.hex()
                }
            },


            // ------
            // Operators
            {
                "name": "Operators",
                "scope": ["keyword.operator"],
                "settings": {
                    "foreground": COLORS.syntax.operator.hex()
                }
            },


            // ------
            // Punctuation
            {
                "name": "Separators like ; or ,",
                "scope": ["punctuation.separator", "punctuation.terminator"],
                "settings": {
                    "foreground": COLORS.common.fg.alpha(.7).hex()
                }
            },
            {
                "name": "Punctuation",
                "scope": ["punctuation.section"],
                "settings": {
                    "foreground": COLORS.common.fg.hex()
                }
            },
            {
                "name": "Accessor",
                "scope": ["punctuation.accessor"],
                "settings": {
                    "foreground": COLORS.syntax.operator.hex()
                }
            },


            // ------
            // Types
            {
                "name": "Types fixes",
                "scope": [
                    "source.java storage.type",
                    "source.haskell storage.type",
                    "source.c storage.type",
                ],
                "settings": {
                    "foreground": COLORS.syntax.entity.hex()
                }
            },
            {
                "name": "Inherited class type",
                "scope": ["entity.other.inherited-class"],
                "settings": {
                    "foreground": COLORS.syntax.tag.hex()
                }
            },
            // Fixes
            {
                "name": "Lambda arrow",
                "scope": ["storage.type.function"],
                "settings": {
                    "foreground": COLORS.syntax.keyword.hex()
                }
            },
            {
                "name": "Java primitive variable types",
                "scope": ["source.java storage.type.primitive"],
                "settings": {
                    "foreground": COLORS.syntax.tag.hex()
                }
            },


            // ------
            // Function/method names in definitions
            // and calls
            {
                "name": "Function name",
                "scope": ["entity.name.function"],
                "settings": {
                    "foreground": COLORS.syntax.func.hex()
                }
            },
            {
                "name": "Function arguments",
                "scope": ["variable.parameter", "meta.parameter"],
                "settings": {
                    "fontWeight": "bold",
                    "foreground": COLORS.syntax.constant.hex()
                }
            },
            {
                "name": "Function call",
                "scope": [
                    "variable.function",
                    "variable.annotation",
                    "meta.function-call.generic",
                    "support.function.go"
                ],
                "settings": {
                    "foreground": COLORS.syntax.func.hex()
                }
            },
            {
                "name": "Library function",
                "scope": ["support.function", "support.macro"],
                "settings": {
                    "foreground": COLORS.syntax.markup.hex()
                }
            },


            // ------
            // Import/export paths
            {
                "name": "Imports and packages",
                "scope": ["entity.name.import", "entity.name.package"],
                "settings": {
                    "foreground": COLORS.syntax.string.hex()
                }
            },
            {
                "name": "Entity name",
                "scope": ["entity.name"],
                "settings": {
                    "foreground": COLORS.syntax.entity.hex()
                }
            },

            // Tag and their attributes
            {
                "name": "Tag",
                "scope": ["entity.name.tag", "meta.tag.sgml"],
                "settings": {
                    "foreground": COLORS.syntax.tag.hex()
                }
            },
            {
                "name": "Tag start/end",
                "scope": [
                    "punctuation.definition.tag.end",
                    "punctuation.definition.tag.begin",
                    "punctuation.definition.tag"
                ],
                "settings": {
                    "foreground": COLORS.syntax.tag.alpha(.5).hex()
                }
            },
            {
                "name": "Tag attribute",
                "scope": ["entity.other.attribute-name"],
                "settings": {
                    "foreground": COLORS.syntax.func.hex()
                }
            },


            {
                "name": "Library constant",
                "scope": ["support.constant"],
                "settings": {
                    "fontStyle": "italic",
                    "foreground": COLORS.syntax.operator.hex()
                }
            },
            {
                "name": "Library class/type",
                "scope": ["support.type", "support.class", "source.go storage.type"],
                "settings": {
                    "foreground": COLORS.syntax.tag.hex()
                }
            },
            {
                "name": "Decorators/annotation",
                "scope": [
                    "meta.decorator variable.other",
                    "meta.decorator punctuation.decorator",
                    "storage.type.annotation"
                ],
                "settings": {
                    "foreground": COLORS.syntax.special.hex()
                }
            },
            {
                "name": "Invalid",
                "scope": ["invalid"],
                "settings": {
                    "foreground": COLORS.syntax.error.hex()
                }
            },
            {
                "name": "diff.header",
                "scope": ["meta.diff", "meta.diff.header"],
                "settings": {
                    "foreground": "#c594c5"
                }
            },
            {
                "name": "Ruby class methods",
                "scope": ["source.ruby variable.other.readwrite"],
                "settings": {
                    "foreground": COLORS.syntax.func.hex()
                }
            },
            {
                "name": "CSS tag names",
                "scope": [
                    "source.css entity.name.tag",
                    "source.sass entity.name.tag",
                    "source.scss entity.name.tag",
                    "source.less entity.name.tag",
                    "source.stylus entity.name.tag"
                ],
                "settings": {
                    "foreground": COLORS.syntax.entity.hex()
                }
            },
            {
                "name": "CSS browser prefix",
                "scope": [
                    "source.css support.type",
                    "source.sass support.type",
                    "source.scss support.type",
                    "source.less support.type",
                    "source.stylus support.type"
                ],
                "settings": {
                    "foreground": COLORS.syntax.comment.hex()
                }
            },
            {
                "name": "CSS Properties",
                "scope": ["support.type.property-name"],
                "settings": {
                    "fontStyle": "normal",
                    "foreground": COLORS.syntax.tag.hex()
                }
            },
            {
                "name": "Search Results Nums",
                "scope": ["constant.numeric.line-number.find-in-files - match"],
                "settings": {
                    "foreground": COLORS.syntax.comment.hex()
                }
            },
            {
                "name": "Search Results Match Nums",
                "scope": ["constant.numeric.line-number.match"],
                "settings": {
                    "foreground": COLORS.syntax.keyword.hex()
                }
            },
            {
                "name": "Search Results Lines",
                "scope": ["entity.name.filename.find-in-files"],
                "settings": {
                    "foreground": COLORS.syntax.string.hex()
                }
            },
            {
                "scope": ["message.error"],
                "settings": {
                    "foreground": COLORS.syntax.error.hex()
                }
            },
            {
                "name": "Markup heading",
                "scope": ["markup.heading", "markup.heading entity.name"],
                "settings": {
                    "fontStyle": "bold",
                    "foreground": COLORS.syntax.string.hex()
                }
            },
            {
                "name": "Markup links",
                "scope": ["markup.underline.link", "string.other.link"],
                "settings": {
                    "foreground": COLORS.syntax.tag.hex()
                }
            },
            {
                "name": "Markup Italic",
                "scope": ["markup.italic"],
                "settings": {
                    "fontStyle": "italic",
                    "foreground": COLORS.syntax.markup.hex()
                }
            },
            {
                "name": "Markup Bold",
                "scope": ["markup.bold"],
                "settings": {
                    "fontStyle": "bold",
                    "foreground": COLORS.syntax.markup.hex()
                }
            },
            {
                "name": "Markup Bold/italic",
                "scope": ["markup.italic markup.bold", "markup.bold markup.italic"],
                "settings": {
                    "fontStyle": "bold italic"
                }
            },
            {
                "name": "Markup Code",
                "scope": ["markup.raw"],
                "settings": {
                    "background": COLORS.common.fg.alpha(.02).hex()
                }
            },
            {
                "name": "Markup Code Inline",
                "scope": ["markup.raw.inline"],
                "settings": {
                    "background": COLORS.common.fg.alpha(.06).hex()
                }
            },
            {
                "name": "Markdown Separator",
                "scope": ["meta.separator"],
                "settings": {
                    "fontStyle": "bold",
                    "background": COLORS.common.fg.alpha(.06).hex(),
                    "foreground": COLORS.syntax.comment.hex()
                }
            },
            {
                "name": "Markup Blockquote",
                "scope": ["markup.quote"],
                "settings": {
                    "foreground": COLORS.syntax.regexp.hex(),
                    "fontStyle": "italic"
                }
            },
            {
                "name": "Markup List Bullet",
                "scope": ["markup.list punctuation.definition.list.begin"],
                "settings": {
                    "foreground": COLORS.syntax.func.hex()
                }
            },
            {
                "name": "Markup added",
                "scope": ["markup.inserted"],
                "settings": {
                    "foreground": COLORS.vcs.added.hex()
                }
            },
            {
                "name": "Markup modified",
                "scope": ["markup.changed"],
                "settings": {
                    "foreground": COLORS.vcs.modified.hex()
                }
            },
            {
                "name": "Markup removed",
                "scope": ["markup.deleted"],
                "settings": {
                    "foreground": COLORS.vcs.removed.hex()
                }
            },
            {
                "name": "Markup Strike",
                "scope": ["markup.strike"],
                "settings": {
                    "foreground": COLORS.syntax.special.hex()
                }
            },
            {
                "name": "Markup Table",
                "scope": ["markup.table"],
                "settings": {
                    "background": COLORS.common.fg.alpha(.06).hex(),
                    "foreground": COLORS.syntax.tag.hex()
                }
            },
            {
                "name": "Markup Raw Inline",
                "scope": ["text.html.markdown markup.inline.raw"],
                "settings": {
                    "foreground": COLORS.syntax.operator.hex()
                }
            },
            {
                "name": "Markdown - Line Break",
                "scope": ["text.html.markdown meta.dummy.line-break"],
                "settings": {
                    "background": COLORS.syntax.comment.hex(),
                    "foreground": COLORS.syntax.comment.hex()
                }
            },
            {
                "name": "Markdown - Raw Block Fenced",
                "scope": ["punctuation.definition.markdown"],
                "settings": {
                    "background": COLORS.common.fg.hex(),
                    "foreground": COLORS.syntax.comment.hex()
                }
            }
        ]
    }
}

function generateTheme() {
    let theme = getTheme()
    let themeJSON = JSON.stringify(theme)
    fs.writeFileSync(path.join(__dirname, "themes", "ErikWDevTheme-color-theme.json"), themeJSON)
}

generateTheme()