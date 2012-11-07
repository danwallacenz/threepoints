Ext.define("GMarks.model.Mark", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [
            { name: 'beacon_type', type: 'string' },
			{ name: 'current_mark_name', type: 'string' },
			{ name: 'description', type: 'string' },
			{ name: 'ellipsoidal_height', type: 'string' },
			{ name: 'geodetic_code', type: 'string' },
			{ name: 'id', type: 'string' },
			{ name: 'land_district', type: 'string' },
			{ name: 'latitude', type: 'string' },
			{ name: 'longitude', type: 'string' },
			{ name: 'mark_condition', type: 'string' },
			{ name: 'mark_type', type: 'string' },
			{ name: 'order', type: 'string' }
        ],
        validations: [
            { type: 'presence', field: 'id' },
            { type: 'presence', field: 'current_mark_name', message: 'Please enter a name for this mark.' }
        ]
    }
});