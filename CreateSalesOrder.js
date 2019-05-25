function CreateNetSuiteOrder(requestBody) {

    log.debug('Post body', requestBody);

    var salesOrder = record.create({
        type: record.Type.SALES_ORDER,
        isDynamic: true,
        defaultValues: {
            entity: 123242440099
        }
    });


    salesOrder.setValue({ fieldId: 'trandate', value: new Date('5/25/2019') });

    var subrec = salesOrder.getSubrecord({
        fieldId: 'shippingaddress'
    });

    subrec.setValue({ fieldId: 'addr1', value: '123 street' });
    subrec.setValue({ fieldId: 'city', value: 'city' });
    subrec.setValue({ fieldId: 'state', value: 'state' });
    subrec.setValue({ fieldId: 'zip', value: 'CA' });
    subrec.setValue({ fieldId: 'addressee', value: 'John' });

    subrec.setValue({ fieldId: 'attention', value: 'John' });


    salesOrder.selectNewLine({
        sublistId: 'item'
    });


    var items = requestBody.items;
    items.forEach(function (item) {

        salesOrder.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'item',
            value: '4353535334535'//internal id 
        });

        salesOrder.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
            value: item.quantity_order
        });
        salesOrder.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'price',
            value: -1 //custom in netsuite
        });

        salesOrder.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'rate',
            value: item.price_value
        });

        salesOrder.commitLine({
            sublistId: 'item'
        });
    });

    try {
        var id = salesOrder.save({
            ignoreMandatoryFields: false
        });
        log.debug('record save with id', id);//sales order internal id

        return id;
    } catch (e) {
        return 0;
    }


}