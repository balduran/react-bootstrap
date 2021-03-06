import classNames from 'classnames';
import PropTypes from 'prop-types';
import isRequiredForA11y from 'prop-types-extra/lib/isRequiredForA11y';
import React from 'react';
import { useDropdownToggle } from 'react-overlays/DropdownToggle';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import Button, { ButtonProps, CommonButtonProps } from './Button';
import { useBootstrapPrefix } from './ThemeProvider';
import useWrappedRefWithWarning from './useWrappedRefWithWarning';
import {
  BsPrefixPropsWithChildren,
  BsPrefixRefForwardingComponent,
} from './helpers';

export interface DropdownToggleProps
  extends BsPrefixPropsWithChildren,
    ButtonProps {
  split?: boolean;
  childBsPrefix?: string;
  eventKey?: any; // TODO: fix this type
}

type DropdownToggle = BsPrefixRefForwardingComponent<
  'button',
  DropdownToggleProps
>;

export type PropsFromToggle = Partial<
  Pick<React.ComponentPropsWithRef<DropdownToggle>, CommonButtonProps>
>;

const propTypes = {
  /**
   * @default 'dropdown-toggle'
   */
  bsPrefix: PropTypes.string,

  /**
   * An html id attribute, necessary for assistive technologies, such as screen readers.
   * @type {string|number}
   * @required
   */
  id: isRequiredForA11y(PropTypes.any),

  split: PropTypes.bool,

  as: PropTypes.elementType,

  /**
   * to passthrough to the underlying button or whatever from DropdownButton
   * @private
   */
  childBsPrefix: PropTypes.string,
};

const DropdownToggle: DropdownToggle = React.forwardRef(
  (
    {
      bsPrefix,
      split,
      className,
      childBsPrefix,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = Button,
      ...props
    }: DropdownToggleProps,
    ref,
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-toggle');

    if (childBsPrefix !== undefined) {
      (props as any).bsPrefix = childBsPrefix;
    }

    const [toggleProps, { toggle }] = useDropdownToggle();

    toggleProps.ref = useMergedRefs(
      toggleProps.ref,
      useWrappedRefWithWarning(ref, 'DropdownToggle'),
    );

    // This intentionally forwards size and variant (if set) to the
    // underlying component, to allow it to render size and style variants.
    return (
      <Component
        onClick={toggle}
        className={classNames(className, prefix, split && `${prefix}-split`)}
        {...toggleProps}
        {...props}
      />
    );
  },
);

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = propTypes;

export default DropdownToggle;
