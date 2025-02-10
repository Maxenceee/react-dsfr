import React, {
    memo,
    forwardRef,
    type ReactNode,
    type RefAttributes,
    type MemoExoticComponent,
    type ForwardRefExoticComponent,
    type CSSProperties,
    type ComponentProps
} from "react";
import { fr } from "./fr";
import { cx } from "./tools/cx";
import type { FrIconClassName, RiIconClassName } from "./fr/generatedFromCss/classNames";
import { getLink } from "./link";
import type { RegisteredLinkProps } from "./link";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { symToStr } from "tsafe/symToStr";
import { useAnalyticsId } from "./tools/useAnalyticsId";

type DataAttribute = Record<`data-${string}`, string | boolean | null | undefined>;

export type TagProps = TagProps.Common &
    (TagProps.WithIcon | TagProps.WithoutIcon) &
    (TagProps.AsAnchor | TagProps.AsButton | TagProps.AsParagraph);
export namespace TagProps {
    export type Common = {
        id?: string;
        className?: string;
        /** Default: false */
        small?: boolean;
        style?: CSSProperties;
        title?: string;
        children: ReactNode;
    };

    export type WithIcon = {
        /** Function of the button, to provide if the label isn't explicit */
        iconId: FrIconClassName | RiIconClassName;
    };

    export type WithoutIcon = {
        iconId?: never;
    };

    export type AsAnchor = {
        linkProps: RegisteredLinkProps;
        onClick?: never;
        nativeButtonProps?: never;
        /** @deprecated Tag is now <p> by default. Use `nativeParagraphProps` instead. */
        nativeSpanProps?: never;
        nativeParagraphProps?: never;
        dismissible?: never;
        pressed?: never;
    };
    export type AsButton = {
        linkProps?: never;
        /** @deprecated Tag is now <p> by default. Use `nativeParagraphProps` instead. */
        nativeSpanProps?: never;
        nativeParagraphProps?: never;
        /** Default: false */
        dismissible?: boolean;
        pressed?: boolean;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        nativeButtonProps?: ComponentProps<"button"> & DataAttribute;
    };
    export type AsParagraph = {
        linkProps?: never;
        onClick?: never;
        dismissible?: never;
        pressed?: never;
        nativeButtonProps?: never;
        /** @deprecated Tag is now <p> by default. Use `nativeParagraphProps` instead. */
        nativeSpanProps?: ComponentProps<"span"> & DataAttribute;
        nativeParagraphProps?: ComponentProps<"p"> & DataAttribute;
    };

    /** @deprecated Tag is now <p> by default. Use `AsParagraph` instead. */
    export type AsSpan = AsParagraph;
}

/** @see <https://components.react-dsfr.codegouv.studio/?path=/docs/components-tag> */
export const Tag = memo(
    forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLParagraphElement, TagProps>(
        (props, ref) => {
            const {
                id: id_props,
                className: prop_className,
                children,
                title,
                iconId,
                small = false,
                pressed,
                dismissible = false,
                linkProps,
                nativeButtonProps,
                nativeParagraphProps,
                nativeSpanProps,
                style,
                onClick,
                ...rest
            } = props;

            assert<Equals<keyof typeof rest, never>>();

            const id = useAnalyticsId({
                "defaultIdPrefix": "fr-tag",
                "explicitlyProvidedId": id_props
            });

            const { Link } = getLink();

            const className = cx(
                fr.cx(
                    "fr-tag",
                    small && `fr-tag--sm`,
                    iconId,
                    iconId && "fr-tag--icon-left", // actually, it's always left but we need it in order to have the icon rendering
                    dismissible && "fr-tag--dismiss"
                ),
                linkProps !== undefined && linkProps.className,
                prop_className
            );

            const nativeParagraphOrSpanProps = nativeParagraphProps ?? nativeSpanProps;

            return (
                <>
                    {linkProps !== undefined && (
                        <Link
                            {...linkProps}
                            id={id_props ?? linkProps.id ?? id}
                            title={title ?? linkProps.title}
                            className={cx(linkProps?.className, className)}
                            style={{
                                ...linkProps?.style,
                                ...style
                            }}
                            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
                            {...rest}
                        >
                            {children}
                        </Link>
                    )}
                    {nativeButtonProps !== undefined && (
                        <button
                            {...nativeButtonProps}
                            id={id_props ?? nativeButtonProps.id ?? id}
                            className={cx(nativeButtonProps?.className, className)}
                            style={{
                                ...nativeButtonProps?.style,
                                ...style
                            }}
                            title={title ?? nativeButtonProps?.title}
                            onClick={onClick ?? nativeButtonProps?.onClick}
                            disabled={nativeButtonProps?.disabled}
                            ref={ref as React.ForwardedRef<HTMLButtonElement>}
                            aria-pressed={pressed}
                            {...rest}
                        >
                            {children}
                        </button>
                    )}
                    {linkProps === undefined && nativeButtonProps === undefined && (
                        <p
                            {...nativeParagraphOrSpanProps}
                            id={id_props ?? nativeParagraphOrSpanProps?.id ?? id}
                            className={cx(nativeParagraphOrSpanProps?.className, className)}
                            style={{
                                ...nativeParagraphOrSpanProps?.style,
                                ...style
                            }}
                            title={title ?? nativeParagraphOrSpanProps?.title}
                            ref={ref as React.ForwardedRef<HTMLParagraphElement>}
                            {...rest}
                        >
                            {children}
                        </p>
                    )}
                </>
            );
        }
    )
) as MemoExoticComponent<
    ForwardRefExoticComponent<
        TagProps.Common &
            (TagProps.WithIcon | TagProps.WithoutIcon) &
            (
                | (TagProps.AsAnchor & RefAttributes<HTMLAnchorElement>)
                | (TagProps.AsButton & RefAttributes<HTMLButtonElement>)
                | (TagProps.AsParagraph & RefAttributes<HTMLParagraphElement>)
            )
    >
>;

Tag.displayName = symToStr({ Tag });

export default Tag;
