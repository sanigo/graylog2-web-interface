'use strict';

var React = require('react');
var FieldHelpers = require('./FieldHelpers');

var NumberField = React.createClass({
    MAX_SAFE_INTEGER: (Number.MAX_SAFE_INTEGER !== undefined ? Number.MAX_SAFE_INTEGER : Math.pow(2,53)-1),
    MIN_SAFE_INTEGER: (Number.MIN_SAFE_INTEGER !== undefined ? Number.MIN_SAFE_INTEGER : -1*(Math.pow(2,53)-1)),
    getInitialState() {
        return {
            typeName: this.props.typeName,
            field: this.props.field,
            title: this.props.title,
            value: this.props.value
        };
    },
    componentWillReceiveProps(props) {
        this.setState(props);
    },
    mapValidationAttribute(attribute) {
        switch(attribute.toLocaleUpperCase()) {
            case "ONLY_NEGATIVE": return {min: this.MIN_SAFE_INTEGER, max: -1};
            case "ONLY_POSITIVE": return {min: 0, max: this.MAX_SAFE_INTEGER};
            case "IS_PORT_NUMBER": return {min: 0, max: 65535};
            default: return {};
        }
    },
    validationSpec(field) {
        var validationAttributes = field.attributes.map(this.mapValidationAttribute);
        if (validationAttributes.length > 0) {
            // The server may return more than one validation attribute, but it doesn't make sense to use more
            // than one validation for a number field, so we return the first one
            return validationAttributes[0];
        } else {
            return {};
        }
    },
    handleChange(evt) {
        this.props.onChange(this.state.title, evt.target.value);
        this.setState({value: evt.target.value});
    },
    render() {
        var typeName = this.state.typeName;
        var field = this.state.field;
        var isRequired = !field.is_optional;
        var validationSpecs = this.validationSpec(field);
        var defaultValue = field.default_value;

        return (
            <div className="form-group">
                <label htmlFor={typeName + "-" + field.title}>
                    {field.human_name}
                    {FieldHelpers.optionalMarker(field)}
                </label>
                <input id={field.title} type="number" required={isRequired} onChange={this.handleChange} value={this.state.value}
                       defaultValue={defaultValue} className="input-xlarge validatable form-control"
                       {...validationSpecs}/>

                <p className="help-block">{field.description}</p>
            </div>
        );
    }
});

module.exports = NumberField;
