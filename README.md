# React Focus Navigation

This project aims to build a navigation tool based on React.

# How to install

Run the following command:

    npm install --save-dev react-focus-navigation 

or in case of using yarn:

    yarn add react-focus-navigation --dev

# How to use

There are 3 main components:

- Controller
- Parent
- Child

The main idea is the following:

There is one single controller in charge of managing the focus, it means that there is a global state that represents where the focus is.

This controller has N different parents and each parent has M children. The structure could be like the following:

                         /-----   Controller   -----
                      /               |               \
                   /                  |                 \
                /                     |                   \
            Parent1                 Parent2              Parent3
          /   |   \                   |                   /    \
         /    |    \                  |                  /       \
    Child1  Child2 Child3           Child1             Child1    Child2

By default, the focus starts on the first child of the first parent. If this component has implemented the method "onFocus", it will be executed ( You can define which component you want to start with the focus by passing `withFocus` )

Let's say that we want to move the focus to the next child, we need to press the arrow keys in order to move the focus ( we will review this point later ) and the focus is moved from the Child 1 to Child 2.

If Child 1 has implemented the method "onBlur" it will be executed by the controller before moving the focus to the next Child ( Child 2 ) and if this component has implemented the function "onFocus" it will be executed.

Once the focus is on one component, by pressing "ENTER", if the component has implemented the method "onEnter" it will be executed.

Apart of the children management, it's also posible to attach some events when the focus is moved to one of the children associated to one parent. Using the same approach that we used with children, we can define onFocus and onBlur and pass these methods
as props to the Parent.

# Example

```js
import React from "react";
import ReactDOM from "react-dom";
import { Controller, Child, VerticalParent } from "react-focus-navigation";

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

  enter(index) {
    alert("Enter on element", index);
  }

  render() {
    return (
      <Child
        onFocus={index => this.focus()}
        onEnter={index => this.enter(index)} // These methods return the index of the element
        onBlur={index => this.blur()}
      >
        <span
          className={this.state.focused ? "focusable focused" : "focusable"}
        />
      </Child>
    );
  }
}

class App extends React.Component {
  focus() {
    alert("focus");
  }

  blur() {
    alert("blur");
  }

  onReceive(index) {
    alert("focus received on List " + index);
  }

  render() {
    return (
      <Controller>
        <h1>
          Vertical Columns - By default, it moves the focus either up or down
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
            onFocus={() => this.focus()}
            onBlur={() => this.blur()}
            onReceive={index => this.onReceive(index)}
            className={"vertical-focusable"}
          >
            <Item />
            <Item />
          </VerticalParent>
          <VerticalParent
            onReceive={index => this.onReceive(index)}
            className={"vertical-focusable"}>
            <Item />
            <Item />
            <span className="focusable">
              <span> I am not allowed to be focused </span>
              <span> This item is not part of the Matrix </span>
            </span>
            <Item />
          </VerticalParent>
        </div>
      </Controller>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

# Parents

There are 3 kind of different parents:

- Vertical Parent
- Horizontal Parent
- Matrix Parent

As you can imagine, it represents the different ways we can navigate through the parents using the arrow keys.

## Vertical Parent

By default, if we want to move from one child to another, we should use "UP" and "DOWN". By pressing "UP" we will move the focus to the next child ( if present ) and by pressing "DOWN" we will move the focus to the previous child ( if present ).

We can combine multiple parents in order to create something like the following:

    VerticalParent 1    VerticalParent 2
    |                   |
    |-- Child 1         |-- Child 1
    |                   |
    |-- Child 2         |-- Child 2

Let's say the focus is on the child 2 of the parent 1. There are 4 possible scenarios:

- By pressing 'UP' we will move the focus to the Child 1
- By pressing 'DOWN' there won't be any efect as there are not more children
- By pressing 'LEFT' there won't be any efect as there are not previous parents
- By pressing 'RIGHT' we will move the focus to the first child of the next parent

## Horizontal Parent

By default, if we want to move from one child to another, we should use "LEFT" and "RIGHT". By pressing "RIGHT" we will move the focus to the next child ( if present ) and by pressing "LEFT" we will move the focus to the previous child ( if present ).

We can combine multiple parents in order to create something like the following:

    HorizontalParent 1 -- Child 1 -- Child 2
    HorizontalParent 2 -- Child 1 -- Child 2

Let's say the focus is on the child 2 of the parent 1. There are 4 possible scenarios:

- By pressing 'LEFT' we will move the focus to the Child 1
- By pressing 'RIGHT' there won't be any efect as there are not more children
- By pressing 'DOWN' we will move the focus to Child 1 of the next parent ( Parent 2)
- By pressing 'UP' there won't be any efect as there are not previous parents

## Matrix Parent

By default, if we want to move from one child to another, we can use any arrow key in order to simulate all directions.

Given the following example:

              MatrixParent 1
                || ( It represents that all children belong to Parent 1)
                ||
    Child 1 -- Child 2 -- Child 3
      |          |           |
    Child 4 -- Child 5 -- Child 6
      |          |           |
    Child 7 -- Child 8 -- Child 9

Let's say the focus is on the child 5. There are 4 possible scenarios:

- By pressing 'LEFT' we will move the focus to the Child 4
- By pressing 'RIGHT' we will move the focus to the Child 6
- By pressing 'DOWN' we will move the focus to the Child 8
- By pressing 'UP' we will move the focus to the Child 2

## Joining multiple different Parents

It's possible to combine different kind of parents in order to try to represent the best navigation experience. Let's say we have the following structure:

    VerticalParent 1  --------  MatrixParent 2
    |                               ||
    |-Child 1                       ||
    |                Child 1 -- Child 2 -- Child 3
    |-Child 2             |           |
    |                Child 4 -- Child 5 -- Child 6
    |-Child 3             |           |
                     Child 7 -- Child 8 -- Child 9

Let's say that by default, the Controller moves the focus to the Child 1 on the first Parent ( Parent 1).

There are 4 different scenarios:

- By pressing 'DOWN', it moves the focus to the Child 2 of the Parent 1
- By pressing 'RIGHT", It moves the focus to the Child 1 of the Parent 2
- By pressing 'LEFT, there won't be any effect as there are not previous parents
- By pressing 'UP', there won't be any effect as there are not previous children.

Imagine we press 'RIGHT". It will move the focus to the Child 1 of the Parent 2.
As we have moved from a VerticalParent to a MatrixParent, now we have changed the way we can navigate.

Then, there are 4 different scenarios:

- By pressing 'DOWN', it moves the focus from Child 1 to Child 4
- By pressing 'UP', it moves the focus to the previous parent ( Vertical Parent)
- By pressing 'RIGHT", it moves the focus from Child 1 to Child 2 ( Same Parent )
- By pressing 'LEFT', it moves the focus to the previous parent as well ( Vertical Parent )

## Starting with the focus

Sometimes, you will need to start with the focus in another Parent that it's not the first one. You can do that by passing the `withFocus` as props:

```js
<Controller>
  <VerticalParent>
    <Children />
    <Children />
  </VerticalParent>
  <VerticalParent>
    <Children />
    <Children />
  </VerticalParent>
  <VerticalParent withFocus>
    <Children />
    <Children />
  </VerticalParent>
</Controller>
```

This way, the app will start having the focus on the third parent instead of the first one. In case of more than one parent using `withFocus`, the last one will have the focus.

## Identifying wich elements execute the functions

Both onFocus, onBlur and onEnter, will provide the index as argument of the function execution. This way, it's easier to define which element has either received the focus or received an 'enter' and apply the logic associated to this.
Given this example:

```js
  onFocus(index) {
    if (this.props.onFocus) {
      this.props.onFocus();
    }

    if (this.content) {
      const items = this.content.getElementsByClassName("item");
      const offsetWidth = items[0].offsetWidth + 20;
      this.content.scrollLeft = offsetWidth * index;
    }
  }

  render() {
    const { contents } = this.props;
    return (
        <h1>{this.props.title}</h1>
        <div
          className="content"
          ref={content => {
            this.content = content;
          }}
        >
          <HorizontalParent
            style={{ overflow: "hidden", display: "block" }}
            onFocus={index => this.onFocus(index)}
            withFocus={this.props.withFocus}
          >
            {contents.map(content => (
              <Child key={content.id} {...content} />
            ))}
          </HorizontalParent>
        </div>
      </div>
    );
  }
```

We can move the scroll of the list based on the element with the focus.

# Example

There is an example in order to understand how to combine multiple Parents. Please, check the folder `example` in order to use how to reproduce different scenarios
