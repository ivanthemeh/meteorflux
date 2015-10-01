# MeteorFlux Dispatcher-Blaze-Helper

If you want to dispatch Flux actions straight from Blaze, this is your
package!

### How to use it

In your HTML code, just add `data-action` to any `a`, `button` or `form`.

```html
<a href='#' data-action='SOMETHING_HAPPENED'>Something!</a>
<!-- or -->
<button data-action='BUTTON_PUSHED'>Something!</button>
<!-- or -->
<form data-action='FORM_SENT'>
  <input type="text" name="username">
  <input type="submit" name="Send!">
</form>
```

Any of those codes will send an action with a payload like this:

```javascript
{
  actionType: 'SOMETHING_HAPPENED',
  data: // the data context. Equivalent to 'this'.
  event: // the event which triggered the action.
  template: // the template in where the action was triggered.
}
```

When using anchor, you need to set a `href`, but the event will prevent the
default behaviour, so it won't be used. Setting it to `href='#'` works.

### License

MIT licensed, check LICENSE.txt in https://github.com/meteorflux/meteorflux
