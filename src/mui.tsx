"use client";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useEffect, createContext, useContext, type ReactNode } from "react";
import * as mui from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";
import { fr } from "./fr";
import { useIsDark } from "./useIsDark";
import { typography } from "./fr/generatedFromCss/typography";
import { spacingTokenByValue } from "./fr/generatedFromCss/spacing";
import { assert } from "tsafe/assert";
import { objectKeys } from "tsafe/objectKeys";
import { id } from "tsafe/id";
import { useBreakpointsValuesPx, type BreakpointsValues } from "./useBreakpointsValuesPx";
import { structuredCloneButFunctions } from "./tools/structuredCloneButFunctions";
import { deepAssign } from "./tools/deepAssign";
import { Global, css } from "@emotion/react";
import { getAssetUrl } from "./tools/getAssetUrl";
import marianneFaviconSvgUrl from "./dsfr/favicon/favicon.svg";
import blankFaviconSvgUrl from "./assets/blank-favicon.svg";

export function getMuiDsfrThemeOptions(params: {
    isDark: boolean;
    breakpointsValues: BreakpointsValues;
}): mui.ThemeOptions {
    const { isDark, breakpointsValues } = params;

    const { options, decisions } = fr.colors.getHex({ isDark });

    return {
        "shape": {
            "borderRadius": 0
        },
        "breakpoints": {
            //NOTE: We would use "unit": breakpointsValuesUnit but only "px" works.
            "unit": "px",
            "values": breakpointsValues
        },
        "palette": {
            "mode": isDark ? "dark" : "light",
            "primary": {
                "main": options.blueFrance.sun113_625.default,
                "light": options.blueFrance.sun113_625.active,
                "dark": options.blueFrance.sun113_625.hover,
                "contrastText": options.blueFrance._975sun113.default
            },
            "secondary": {
                "main": options.blueFrance._950_100.default,
                "light": options.blueFrance._950_100.active,
                "dark": options.blueFrance._950_100.hover,
                "contrastText": options.blueFrance.sun113_625.default
            },
            "error": {
                "light": options.error._425_625.active,
                "main": options.error._425_625.default,
                "dark": options.error._425_625.hover,
                "contrastText": options.grey._1000_50.default
            },
            "warning": {
                "light": options.warning._425_625.default,
                "main": options.warning._425_625.default,
                "dark": options.warning._425_625.hover,
                "contrastText": options.grey._1000_50.default
            },
            "info": {
                "light": options.info._425_625.active,
                "main": options.info._425_625.default,
                "dark": options.info._425_625.hover,
                "contrastText": options.grey._1000_50.default
            },
            "success": {
                "light": options.success._425_625.active,
                "main": options.success._425_625.default,
                "dark": options.success._425_625.hover,
                "contrastText": options.grey._1000_50.default
            },
            "text": {
                "primary": options.grey._50_1000.default,
                "secondary": options.grey._200_850.default,
                "disabled": options.grey._625_425.default
            },
            "divider": options.grey._900_175.default,
            "action": {
                "active": options.grey._200_850.default,
                "hover": options.grey._975_100.default,
                "selected": options.blueFrance._925_125.active,
                "disabled": options.grey._625_425.default,
                "disabledBackground": options.grey._925_125.default,
                "focus": options.blueFrance.sun113_625.active
            },
            "background": {
                "default": options.grey._1000_50.default,
                "paper": options.grey._1000_100.default
            }
        } as const,
        "typography": (() => {
            const getBySelector = (selector: typeof typography[number]["selector"]) => {
                const variant = typography.find(variant => variant.selector === selector);
                assert(variant !== undefined);

                const style = { ...variant.style };

                //TODO: Investigate why we need to do that.
                delete (style as any).margin;

                return style;
            };

            return {
                "fontFamily": '"Marianne", arial, sans-serif',
                "h1": getBySelector("h1"),
                "h2": getBySelector("h2"),
                "h3": getBySelector("h3"),
                "h4": getBySelector("h4"),
                "h5": getBySelector("h5"),
                "h6": getBySelector("h6"),
                //"subtitle1":
                //"subtitle2":
                "body1": getBySelector("p")
                //"body2": {},
                //"caption": {},
                //"button": {},
                //"overline": {}
            };
        })(),
        "spacing": (() => {
            const values: string[] = [];

            //NOTE: The properties are declared sorted in the object.
            objectKeys(spacingTokenByValue).forEach(key => {
                if (key.endsWith("w")) {
                    values.push(spacingTokenByValue[key]);
                }
            });

            return (abs: string | number) =>
                typeof abs === "string"
                    ? abs
                    : abs === 0
                    ? 0
                    : (() => {
                          const value = values[abs - 1];
                          return value === undefined ? abs : value;
                      })();
        })(),
        "shadows": (() => {
            const [, , , , , , , , ...rest] = mui.createTheme().shadows;

            return id<Shadows>([
                "none",
                /** ButtonBar shadow */
                "0px 6px 10px 0px rgba(0,0,0,0.07)",
                /** Explorer items */
                "0px 4px 4px 0px rgba(0,0,0,0.1)",
                /** LeftBar */
                "6px 0px 16px 0px rgba(0,0,0,0.15)",
                /** AccountTab default */
                "4px 0px 10px 0px rgba(0,0,0,0.07)",
                /** AccountTab active */
                "-4px 0px 10px 0px rgba(0,0,0,0.07)",
                /** Card over */
                "0px 6px 10px 0px rgba(0,0,0,0.14)",
                /** Dialog **/
                "0px 8px 10px -7px rgba(0,0,0,0.07)",
                ...rest
            ]);
        })(),
        "components": {
            "MuiButton": {
                "styleOverrides": {
                    "root": {
                        "textTransform": "unset"
                    }
                }
            },
            "MuiSvgIcon": {
                "styleOverrides": {
                    "colorPrimary": ({ theme }) => ({
                        "color": theme.palette.text.primary
                    })
                }
            },
            "MuiStepIcon": {
                "styleOverrides": {
                    "text": {
                        "fill": fr.colors.getHex({ "isDark": true }).decisions.text.title.grey
                            .default
                    }
                }
            },
            "MuiTablePagination": {
                "styleOverrides": {
                    "displayedRows": {
                        //Fixes: https://user-images.githubusercontent.com/6702424/206063347-65e7d13c-3dea-410c-a0e0-51cf214deba0.png
                        "margin": "unset"
                    },
                    "selectLabel": {
                        //Fixes: https://github.com/codegouvfr/react-dsfr/assets/6702424/678a7f69-d4e8-4897-85f0-65c605b46900
                        "margin": "unset"
                    }
                }
            },
            "MuiTypography": {
                "styleOverrides": {
                    "root": {
                        //Fixes double underline: https://user-images.githubusercontent.com/6702424/206064575-4f036145-ff40-47db-aabd-560f29136e71.png
                        "backgroundImage": "unset"
                    }
                }
            },
            "MuiAutocomplete": {
                "styleOverrides": {
                    "listbox": {
                        "padding": 0
                    },
                    "option": {
                        "padding": `${fr.spacing("2w")} !important`,
                        "&.Mui-focused": {
                            "backgroundColor":
                                decisions.background.open.blueFrance.default + " !important"
                        },
                        "&.Mui-focusVisible": {
                            "backgroundColor":
                                decisions.background.open.blueFrance.default + " !important"
                        }
                    }
                }
            },
            ...(() => {
                const nonTypedMuiComponents = {
                    "MuiDataGrid": {
                        "styleOverrides": {
                            "root": (() => {
                                const set = new WeakSet<Function>();

                                const borderNone = {
                                    "border": "none"
                                };

                                return (params: {
                                    ownerState?: {
                                        getRowClassName?: (params: {
                                            indexRelativeToCurrentPage: number;
                                        }) => string;
                                    };
                                }) => {
                                    const { ownerState } = params;

                                    if (ownerState === undefined) {
                                        return borderNone;
                                    }

                                    if (
                                        ownerState.getRowClassName === undefined ||
                                        !set.has(ownerState.getRowClassName)
                                    ) {
                                        const originalGetRowClassName = ownerState.getRowClassName;

                                        ownerState.getRowClassName = params => {
                                            const { indexRelativeToCurrentPage } = params;

                                            const parityClassName =
                                                indexRelativeToCurrentPage % 2 === 0
                                                    ? "even"
                                                    : "odd";

                                            const className = originalGetRowClassName?.(params);

                                            return className === undefined
                                                ? parityClassName
                                                : `${parityClassName} ${className}`;
                                        };

                                        set.add(ownerState.getRowClassName);
                                    }

                                    return borderNone;
                                };
                            })(),
                            "columnHeaders": {
                                "backgroundColor": decisions.background.contrast.grey.default,
                                "&&": {
                                    "borderColor": decisions.border.plain.grey.default,
                                    "borderPosition": "bottom",
                                    "borderWidth": 2
                                }
                            },
                            "row": () => {
                                const hoveredAndSelected = {
                                    "&.Mui-hovered": {
                                        "backgroundColor":
                                            fr.colors.decisions.background.contrast.grey.hover
                                    },
                                    "&.Mui-selected": {
                                        "backgroundColor":
                                            fr.colors.decisions.background.contrast.grey.active
                                    }
                                };

                                return {
                                    "&.even": {
                                        "backgroundColor":
                                            decisions.background.contrast.grey.default,
                                        "&:hover": {
                                            "backgroundColor":
                                                decisions.background.contrast.grey.hover
                                        },
                                        ...hoveredAndSelected
                                    },
                                    "&.odd": {
                                        "backgroundColor": decisions.background.alt.grey.default,
                                        "&:hover": {
                                            "backgroundColor": decisions.background.alt.grey.hover
                                        },
                                        ...hoveredAndSelected
                                    }
                                };
                            },
                            "columnSeparator": {
                                "display": "none"
                            }
                        }
                    }
                };

                return nonTypedMuiComponents as any as {};
            })()
        }
    };
}

/**
 *Generate a theme base on the options received.
 *
 * @param params — Dark or light mode.
 *
 * @param args — Deep merge the arguments with the about to be returned theme.
 *
 * @returns — A complete, ready-to-use mui theme object.
 */
export function createMuiDsfrTheme(
    params: { isDark: boolean; breakpointsValues: BreakpointsValues },
    ...args: object[]
): mui.Theme {
    const muiTheme = mui.createTheme(getMuiDsfrThemeOptions(params), ...args);

    return muiTheme;
}

export function createMuiDsfrThemeProvider(params: {
    useIsDark?: () => { isDark: boolean };
    augmentMuiTheme?: (params: {
        /** WARNING: The types is lying here.
         * It's a Theme as defined in import type { Theme } from "@mui/material/styles";
         * That is to say before augmentation.
         **/
        nonAugmentedMuiTheme: mui.Theme;
        isDark: boolean;
    }) => mui.Theme;
}) {
    const { augmentMuiTheme, useIsDark: useIsDark_props = useIsDark } = params;

    type Props = {
        children: ReactNode;
        /** If you have implemented theme augmentation */
    };

    function MuiDsfrThemeProvider(props: Props) {
        const { children } = props;

        const { isDark } = useIsDark_props();

        const { breakpointsValues } = useBreakpointsValuesPx();

        const theme = useMemo(() => {
            const nonAugmentedMuiTheme = createMuiDsfrTheme({ isDark, breakpointsValues });

            return augmentMuiTheme === undefined
                ? nonAugmentedMuiTheme
                : augmentMuiTheme({
                      nonAugmentedMuiTheme,
                      isDark
                  });
        }, [isDark, breakpointsValues]);

        return <mui.ThemeProvider theme={theme}>{children}</mui.ThemeProvider>;
    }

    return { MuiDsfrThemeProvider };
}

export const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({});

export default MuiDsfrThemeProvider;

export function createDsfrCustomBrandingProvider(params: {
    createMuiTheme: (params: {
        isDark: boolean;
        /**
         * WARNING: The types can be lying here if you have augmented the theme.
         * It's a Theme as defined in `import type { Theme } from "@mui/material/styles";`
         * That is to say before augmentation.
         * Make sure to set your custom properties if any are declared at the type level.
         **/
        theme_gov: mui.Theme;
    }) => { theme: mui.Theme; faviconUrl?: string };
}) {
    const { createMuiTheme } = params;

    function useMuiTheme() {
        const { isDark } = useIsDark();
        const { breakpointsValues } = useBreakpointsValuesPx();

        const { theme, isGov, faviconUrl_userProvided } = useMemo(() => {
            const theme_gov = createMuiDsfrTheme({ isDark, breakpointsValues });

            // @ts-expect-error: Technic to detect if user is using the government theme
            theme_gov.palette.isGov = true;

            const { theme, faviconUrl: faviconUrl_userProvided } = createMuiTheme({
                isDark,
                theme_gov
            });

            let isGov: boolean;

            // @ts-expect-error: We know what we are doing
            if (theme.palette.isGov) {
                isGov = true;
                // @ts-expect-error: We know what we are doing
                delete theme.palette.isGov;
            } else {
                isGov = false;
            }

            // NOTE: We do not allow customization of the spacing and breakpoints
            if (!isGov) {
                theme.spacing = structuredCloneButFunctions(theme_gov.spacing);
                theme.breakpoints = structuredCloneButFunctions(theme_gov.breakpoints);

                theme.components ??= {};

                deepAssign({
                    target: theme.components as any,
                    source: structuredCloneButFunctions({
                        MuiTablePagination: theme_gov.components!.MuiTablePagination
                    }) as any
                });

                theme.typography = structuredCloneButFunctions(
                    theme_gov.typography,
                    ({ key, value }) => (key !== "fontFamily" ? value : theme.typography.fontFamily)
                );
            }

            return { theme, isGov, faviconUrl_userProvided };
        }, [isDark, breakpointsValues]);

        return { theme, isGov, faviconUrl_userProvided };
    }

    function useFavicon(params: { faviconUrl: string }) {
        const { faviconUrl } = params;

        useEffect(() => {
            document
                .querySelectorAll(
                    'link[rel="apple-touch-icon"], link[rel="icon"], link[rel="shortcut icon"]'
                )
                .forEach(link => link.remove());

            const link = document.createElement("link");
            link.rel = "icon";
            link.href = faviconUrl;
            link.type = (() => {
                if (faviconUrl.startsWith("data:")) {
                    return faviconUrl.split("data:")[1].split(",")[0];
                }
                switch (faviconUrl.split(".").pop()?.toLowerCase()) {
                    case "svg":
                        return "image/svg+xml";
                    case "png":
                        return "image/png";
                    case "ico":
                        return "image/x-icon";
                    default:
                        throw new Error("Unsupported favicon file type");
                }
            })();
            document.head.appendChild(link);

            return () => {
                link.remove();
            };
        }, [faviconUrl]);
    }

    function DsfrCustomBrandingProvider(props: { children: ReactNode }) {
        const { children } = props;

        const { theme, isGov, faviconUrl_userProvided } = useMuiTheme();

        useFavicon({
            faviconUrl:
                faviconUrl_userProvided ??
                getAssetUrl(isGov ? marianneFaviconSvgUrl : blankFaviconSvgUrl)
        });

        return (
            <>
                {!isGov && (
                    <Global
                        styles={css({
                            ":root": {
                                "--text-active-blue-france": theme.palette.primary.main,
                                "--background-active-blue-france": theme.palette.primary.main,
                                "--text-action-high-blue-france": theme.palette.primary.main,
                                "--border-plain-blue-france": theme.palette.primary.main,
                                "--border-active-blue-france": theme.palette.primary.main,
                                "--text-title-grey": theme.palette.text.primary,
                                "--background-action-high-blue-france": theme.palette.primary.main,
                                "--border-default-grey": theme.palette.divider,
                                "--border-action-high-blue-france": theme.palette.primary.main

                                // options:
                                /*
                                "--blue-france-sun-113-625": theme.palette.primary.main,
                                "--blue-france-sun-113-625-active": theme.palette.primary.light,
                                "--blue-france-sun-113-625-hover": theme.palette.primary.dark,
                                "--blue-france-975-sun-113": theme.palette.primary.contrastText,

                                "--blue-france-950-100": theme.palette.secondary.main,
                                "--blue-france-950-100-active": theme.palette.secondary.light,
                                "--blue-france-950-100-hover": theme.palette.secondary.dark,
                                //"--blue-france-sun-113-625": theme.palette.secondary.contrastText,

                                "--grey-50-1000": theme.palette.text.primary,
                                "--grey-200-850": theme.palette.text.secondary,
                                "--grey-625-425": theme.palette.text.disabled,

                                "--grey-900-175": theme.palette.divider,

                                //"--grey-200-850": theme.palette.action.active,
                                "--grey-975-100": theme.palette.action.hover,
                                "--blue-france-925-125-active": theme.palette.action.selected,
                                //"--grey-625-425": theme.palette.action.disabled,
                                "--grey-925-125": theme.palette.action.disabledBackground,
                                //"--blue-france-sun-113-625-active": theme.palette.action.focus,

                                "--grey-1000-50": theme.palette.background.default,
                                "--grey-1000-100": theme.palette.background.paper
                                */
                            },
                            body: {
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.fontSize,
                                //"lineHeight": theme.typography.lineHeight,

                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.background.default
                            },
                            [`.${fr.cx("fr-header__logo")}`]: {
                                display: "none"
                            },
                            [`.${fr.cx("fr-footer__brand")} .${fr.cx("fr-logo")}`]: {
                                display: "none"
                            },
                            [`.${fr.cx("fr-footer__content-list")}`]: {
                                display: "none"
                            },
                            [`.${fr.cx("fr-footer__bottom-copy")}`]: {
                                display: "none"
                            }
                        })}
                    />
                )}
                <context_isGov.Provider value={isGov}>
                    <mui.ThemeProvider theme={theme}>{children}</mui.ThemeProvider>
                </context_isGov.Provider>
            </>
        );
    }

    return { DsfrCustomBrandingProvider };
}

const context_isGov = createContext<boolean | undefined>(undefined);

export function useIsGov() {
    const isGov = useContext(context_isGov);

    if (isGov === undefined) {
        throw new Error("useIsGov must be used within a MuiThemeProvider");
    }

    return { isGov };
}
