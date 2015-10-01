MeteorFlux.AppState = class AppState {
  constructor() {
    let self = this;
    self._NOTSET = undefined;
    self._obj = {};
    self._deps = { children: {}, dep: new Tracker.Dependency() };
  }

  _checkKeyPath(keyPath) {
    if (Match.test(keyPath, String)){
      keyPath = keyPath.split('.');
    } else if (Match.test(keyPath, undefined)) {
      keyPath = [];
    } else if (!Match.test(keyPath, Array)) {
      throw new Error('Invalid keypath');
    }
    return keyPath;
  }

  _keyPathToString(keyPath) {
    return '"' + _.reduce(keyPath, function(memo, string) {
      if (memo === '')
        return string;
      else
        return memo + '.' + string;
    }, '') + '"';
  }

  _getValueInPath(keyPath) {
    let self = this;
    let node = self._obj;
    for (let i = 0; i < keyPath.length; i++) {
      if ((Match.test(node, Object)) && (keyPath[i] in node)) {
        node = node[keyPath[i]];
      } else {
        return self._NOTSET;
      }
    }
    return node;
  }

  _setValue(keyPath, newValue) {
    let self = this;
    let oldValue = self._getValueInPath(keyPath);
    if (oldValue !== newValue) {
      self._setValueOnPath(keyPath, newValue);
      self._changeDep(keyPath);
    }
  }

  _getObjNode(keyPath) {
    let self = this;
    let currentNode = self._obj;
    let nextNode = null;
    for (let i = 0; i < keyPath.length; i++) {
      nextNode = currentNode[keyPath[i]] = currentNode[keyPath[i]] || {};
      currentNode = nextNode;
    }
    return currentNode;
  }

  _createObjFromValue(keyPath, value) {
    let self = this;
    let obj = {};
    let currentNode = obj;
    let nextNode = null;
    for (let i = 0; i < keyPath.length; i++) {
      nextNode = currentNode[keyPath[i]] = currentNode[keyPath[i]] || {};
      if (i === (keyPath.length - 1)) {
        currentNode[keyPath[i]] = value;
      } else {
        currentNode = nextNode;
      }
    }
    return obj;
  }

  _getDepNode(keyPath) {
    let self = this;
    let currentNode = self._deps;
    let nextNode = null;
    for (let i = 0; i < keyPath.length; i++) {
      nextNode = currentNode.children[keyPath[i]] =
        currentNode.children[keyPath[i]] ||
        { children: {}, dep: new Tracker.Dependency() };
      currentNode = nextNode;
    }
    return currentNode.dep;
  }

  _addDep(keyPath){
    let self = this;
    let dep = self._getDepNode(keyPath);
    dep.depend();
  }

  _changeDep(keyPath) {
    let self = this;
    let dep = self._getDepNode(keyPath);
    dep.changed();
  }

  _changeObj(oldObj, newObj, keyPath = []) {
    let self = this;

    for (let key in newObj) {
      if (newObj.hasOwnProperty(key)) {

        keyPath.push(key);

        if (!_.isEqual(oldObj[key], newObj[key])) {

          // If they are not equal, the first thing to do it to mark this
          // keyPath as changed to trigger all the Tracker.autoruns.
          self._changeDep(keyPath);
          console.log(self._keyPathToString(keyPath) +
            ' =>', newObj[key]);

          // Check if it is an object
          if (Match.test(newObj[key], Object)) {

            // Both are objects, use _changeObj again.
            if (!Match.test(oldObj[key], Object)) {
              oldObj[key] = {};
            }
            self._changeObj(oldObj[key], newObj[key], keyPath);

          } else if (Match.test(newObj[key], Array)) {
            let arrayField = { array: newObj[key] };
            if (!Match.test(oldObj[key], Object)) {
              oldObj[key] = {};
            }
            _.extend(oldObj[key], arrayField);
            self._changeDep([...keyPath, 'array']);
          } else {
            // If it's not an object, we just overwrite the value.
            oldObj[key] = newObj[key];
          }
        }
      }
    }
  }

  _registerHelper(path) {
    let self = this;
    Template.registerHelper(path, () => {
      return self.get(path);
    });
  }

  _setFunction(keyPath, func) {
    let self = this;
    Tracker.autorun(() => {
      let result = func();
      // check if it's a Mongo Cursor and run fetch.
      if ((typeof result === 'object') && (result.fetch !== undefined)) {
        self._setObject(keyPath, result.fetch());
      } else {
        self._setObject(keyPath, result);
      }
    });
  }

  _setObject(keyPath, newValue) {
    let self = this;
    let newObjFromValue = self._createObjFromValue(keyPath, newValue);
    self._changeObj(self._obj, newObjFromValue);
    self._registerHelper(keyPath[0]);
  }

  set(keyPath, newValue) {
    let self = this;
    keyPath = self._checkKeyPath(keyPath);

    if (Match.test(newValue, Function)) {
      self._setFunction(keyPath, newValue);
    } else {
      self._setObject(keyPath, newValue);
    }
  }

  get(keyPath) {
    let self = this;
    keyPath = self._checkKeyPath(keyPath);

    let value = self._getValueInPath(keyPath);

    if ((Match.test(value, Object)) && (value.array)) {
      oldValue = value;
      value = value.array;
      _.extend(value, _.omit(oldValue, 'array'));
    }

    if (Tracker.active) {
      self._addDep(keyPath, value);
    }

    return value;

  }
};

AppState = new MeteorFlux.AppState();
