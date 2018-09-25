import React from "react";
import ReactDOM from "react-dom";
import Controller from "./../src/controller";
import {
  VerticalParent,
  HorizontalParent,
  MatrixParent
} from "./../src/parent";
import { Child } from "./../src/child";

export class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  focus() {
    this.setState(() => {
      return { focused: true };
    });
  }

  blur() {
    this.setState(() => {
      return { focused: false };
    });
  }

  enter() {
    alert("Enter");
  }

  render() {
    return (
      <Child
        onFocus={() => this.focus()}
        onEnter={() => this.enter()}
        onBlur={() => this.blur()}
      >
        <span
          className={this.state.focused ? "focusable focused" : "focusable"}
        />
      </Child>
    );
  }
}

class App extends React.Component {
  focus(index) {
    alert("Focus on element " + index);
  }

  blur(index) {
    alert("Blur on element " + index);
  }

  onReceive(index) {
    alert("focus received on List " + index);
  }

  render() {
    return (
      <Controller>
        <h1>
          {" "}
          Vertical Columns - By default, it moves the focus either up or down{" "}
        </h1>
        <p>
          If we move out of the scope of each list, it moves to the next or
          previous parent ( if present, if not, nothing happens )
        </p>
        <p>
          Also, by clicking left or right, it moves to the next or previous
          parent ( if present, if not, nothing happens )
        </p>
        <div className={"vertical-columns"}>
          <VerticalParent
            onFocus={index => this.focus(index)}
            onBlur={index => this.blur(index)}
            onReceive={index => this.onReceive(index)}
            className={"vertical-focusable"}
            withFocus
          >
            <Item />
            <Item />
          </VerticalParent>
          <VerticalParent
            onReceive={index => this.onReceive(index)}
            className={"vertical-focusable"}
          >
            <Item />
            <Item />
            <span className="focusable">
              <span> I am not allowed to be focused </span>
              <span> This item is not part of the Matrix </span>
            </span>
            <Item />
          </VerticalParent>
        </div>
        <h1>
          {" "}
          Horizontal Columns - By default, it moves the focus either left or
          right{" "}
        </h1>
        <p>
          If we move out of the scope of each list, it moves to the next or
          previous parent ( if present, if not, nothing happens )
        </p>
        <p>
          Also, by clicking up or down, it moves to the next or previous parent
          ( if present, if not, nothing happens )
        </p>
        <HorizontalParent className={"horizontal-columns"} withFocus>
          <Item />
          <Item />
        </HorizontalParent>
        <HorizontalParent className={"horizontal-columns"}>
          <Item />
          <Item />
          <span className="focusable">
            <p> I am not allowed to be focused </p>
            <p> lorem ipsum </p>
          </span>
          <Item />
        </HorizontalParent>
        <HorizontalParent className={"horizontal-columns"}>
          <Item />
          <span className="focusable">
            <p> I am not allowed to be focused </p>
            <p> lorem ipsum </p>
          </span>
          <Item />
          <Item />
        </HorizontalParent>
        <h1> Matrix - By default, it moves the focus in all directions </h1>
        <p>
          If we move out of the matrix scope, it moves the focus to the previous
          or next parent ( below or above in this example ) ( if present, if
          not, nothing happens )
        </p>
        <MatrixParent columns={4} rows={3} className="matrix">
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
        </MatrixParent>
        <h1> Horizontal Columns + Vertical Columns </h1>
        <h2> Example merging different kind of parents </h2>
        <div className="horizontal-vertical">
          <VerticalParent className={"vertical-focusable-total"}>
            <Item />
            <Item />
          </VerticalParent>
          <div className="horizontal-section">
            <HorizontalParent className={"horizontal-columns-total"}>
              <Item />
              <Item />
            </HorizontalParent>
            <HorizontalParent className={"horizontal-columns-total"}>
              <Item />
              <Item />
              <span className="focusable">
                <p> I am not allowed to be focused </p>
                <p> lorem ipsum </p>
              </span>
              <Item />
            </HorizontalParent>
            <HorizontalParent className={"horizontal-columns-total"}>
              <Item />
              <span className="focusable">
                <p> I am not allowed to be focused </p>
                <p> lorem ipsum </p>
              </span>
              <Item />
              <Item />
            </HorizontalParent>
          </div>
        </div>
      </Controller>
    );
  }
}
ReactDOM.render(<App />, document.querySelector("#root"));
