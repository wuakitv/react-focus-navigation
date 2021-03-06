// @flow
import React from "react";
import { ParentContext } from "./parent_context";

export class FocusableChild extends React.Component<ChildProps, ChildState> {
  focusbableChildren: Array<Element<FocusableChild>>;

  constructor(props: ChildProps) {
    super(props);
    this.state = { className: props.className || "focusable" };
  }

  componentDidMount() {
    this.addToParentTree();
  }

  componentWillUnmount() {
    this.deleteFromParentTree();
  }

  addToParentTree(): void {
    this.props.context.addChildToTree(this);
  }

  deleteFromParentTree(): void {
    this.props.context.deleteChildFromTree(this);
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

export class Child extends React.Component<ChildProps, ChildState> {
  render() {
    return (
      <ParentContext.Consumer>
        {value => {
          return <FocusableChild {...this.props} context={value} />;
        }}
      </ParentContext.Consumer>
    );
  }
}
