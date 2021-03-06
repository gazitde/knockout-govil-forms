﻿
define(['common/viewModels/ModularViewModel',
        'common/utilities/reflection',
        'common/components/texts/identificationInfo',
        'common/ko/globals/multilanguageobservable',
        'common/ko/BindingHandlers/tlpLockElement',
        'common/ko/fn/defaultValue',
        'common/ko/fn/enabled'
    ],
    function (ModularViewModel, commonReflection, resources) {


        var basicSettings = {
            extenders: {
                required: true
            }, defaultValue: '',
            isEnabled: true
        };

        var defaultSettings = {
            idNum: commonReflection.extendSettingsWithDefaults({ extenders: { idNum: null } }, basicSettings),
            firstName: commonReflection.extendSettingsWithDefaults({ extenders: { hebrewName: null } }, basicSettings),
            lastName: commonReflection.extendSettingsWithDefaults({ extenders: { hebrewName: null } }, basicSettings),
            version: '1.0.0',
            text: resources
        };

        /**   
         * returns a ko.observable created with the given settings.
         * responsible for not putting the extenders if not requested   
         * @param {object} settings -
         * @returns {object} prop
         */
        function modelPropertyFactory(settings) {
            var prop = ko.observable().defaultValue(settings.defaultValue);
            var relevantExtenders = {};
            for (var rule in settings.extenders) {
                if (settings.extenders[rule] !== 'not') {
                    relevantExtenders[rule] = settings.extenders[rule];
                }
            }
            prop.extend(relevantExtenders);
            return prop;
        }

        /**
     * @class  IdentificationInfo
     * @description Group of fields usually used as a unit to perform identification stage. 
     * <br /> Contains fields: <b>ID number</b>, <b>first name</b> and <b>last Name</b>. each comes with it's specific validation rule, unless otherwise requested. 
     * @class IdentificationInfo
     * @name IdentificationInfo
     * @property {string} idNum
     * @property {string} firstName
     * @property {string} lastName
     * @constructs 
     * @param {object} settings -
     * @example    
     * var personalInformation: new IdentificationInfo({ idNum: { applyExtenders: false }, firstName: { defaultValue: 'משה', extenders: { required: false } } }),
     */
        var IdentificationInfo = function (settings) {

            var self = this;

            settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);

            var model = {
                idNum: modelPropertyFactory(settings.idNum),
                lastName: modelPropertyFactory(settings.lastName),
                firstName: modelPropertyFactory(settings.firstName)
            };

            ModularViewModel.call(self, model);

            self.isEnabledIdNum = ko.computed(function () {
                return ko.unwrap(settings.idNum.isEnabled);
            });

            self.isEnabledLastName = ko.computed(function () {
                return ko.unwrap(settings.lastName.isEnabled);
            });

            self.isEnabledFirstName = ko.computed(function () {
                return ko.unwrap(settings.firstName.isEnabled);
            });

            self.labels = ko.multiLanguageObservable({ resource: settings.text, language: settings.language });
        };

        IdentificationInfo.prototype = Object.create(ModularViewModel.prototype);
        IdentificationInfo.prototype.constructor = IdentificationInfo;
        IdentificationInfo.defaultSettings = defaultSettings;

        return IdentificationInfo;
    });