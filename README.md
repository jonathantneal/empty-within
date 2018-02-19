# Empty Within [<img src="http://jonathantneal.github.io/dom-logo.svg" alt="dom logo" width="90" height="90" align="right">][Empty Within]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]

[Empty Within] lets target elements based on whether they are empty editable
text fields or contain empty text editable fields.

[Empty Within] applies an `empty-within` attribute to empty `<textarea>` and
`<input>` text elements, or elements containing them.

```css
.form-field label {
  /* style a label to appear above an input */
}

.form-field[empty-within] label {
  /* style a label differently when .form-field contains an empty input */
}
```

## Usage

Add [Empty Within] to your build tool:

```bash
npm install empty-within
```

Activate [Empty Within] on the `document`:

```js
import emptyWithin from 'empty-within';

emptyWithin(document);
```

## Options

[Empty Within] accepts a secondary paramater to configure the attribute or
class name added to elements matching empty editable fields or containing empty
editable fields.

```js
emptyWithin(document, {
  attr: false,
  className: '.empty-within'
})
```

Falsey values on either `attr` or `className` will disable setting the
attribute or class name on elements matching empty editable fields or containing
empty editable fields.

[npm-url]: https://www.npmjs.com/package/empty-within
[npm-img]: https://img.shields.io/npm/v/empty-within.svg
[cli-url]: https://travis-ci.org/jonathantneal/empty-within
[cli-img]: https://img.shields.io/travis/jonathantneal/empty-within.svg

[Empty Within]: https://github.com/jonathantneal/empty-within
