/**
 * this plugin validates documents before they can be inserted into the RxCollection.
 * It's using z-schema as jsonschema-validator
 * @link https://github.com/zaggino/z-schema
 */
import ZSchema from 'z-schema';
import { wrappedValidateStorageFactory } from '../../plugin-helpers';
export function getValidator(schema) {
  var validatorInstance = new ZSchema();
  var validator = function validator(obj) {
    validatorInstance.validate(obj, schema);
    return validatorInstance;
  };
  return function (docData) {
    var useValidator = validator(docData);
    if (useValidator === true) {
      return;
    }
    var errors = useValidator.getLastErrors();
    if (errors) {
      var formattedZSchemaErrors = errors.map(function (_ref) {
        var title = _ref.title,
          description = _ref.description,
          message = _ref.message;
        return {
          title: title,
          description: description,
          message: message
        };
      });
      return formattedZSchemaErrors;
    } else {
      return [];
    }
  };
}
export var wrappedValidateZSchemaStorage = wrappedValidateStorageFactory(getValidator, 'z-schema');
//# sourceMappingURL=index.js.map