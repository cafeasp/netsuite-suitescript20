/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'],
    /**
     * @param {search} search
     * @param {record} record
     */
    function (search, record) {

        /**
         * Function called upon sending a GET request to the RESTlet.
         *
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
         * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
         * @since 2015.1
         */
        function doGet() {

        }

        /**
         * Function called upon sending a PUT request to the RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
         * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
         * @since 2015.2
         */
        function doPut(requestBody) {

        }

        /**
         * Function called upon sending a POST request to the RESTlet.
         *
         * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
         * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
         * @since 2015.2
         */
        function doPost(requestBody) {
            var salesOrderId = CreateNetSuiteOrder(requestBody);
            if (salesOrderId > 0) {
                log.debug('SO', salesOrderId);
            } else {
                log.debug('SO', 'Fail');
            }
        }

        /**
         * Function called upon sending a DELETE request to the RESTlet.
         *
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
         * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
         * @since 2015.2
         */
        function doDelete(requestParams) {

        }


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

        return {
            'get': doGet,
            put: doPut,
            post: doPost,
            'delete': doDelete
        };

    });