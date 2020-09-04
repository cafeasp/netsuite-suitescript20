/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'],
    /**
     * @param {search} search
     */
    function (search, record, vpmagento, moment) {

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
         *
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
            if (requestBody != undefined) {

                var invoice_id = CreateInvoice(requestBody.id, requestBody.shipDate);

                if (invoice_id != undefined || invoice_id == 0) {
                    log.debug('Invoice Internal ID', invoice_id);
                    return true;
                } else {
                    log.debug('Invoice', 'Fail to create INV: ' + requestBody.id);
                    return false;
                }
            } else {
                return false;
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


        function CreateInvoice(salesOrderId, oDate) {

            try {
                var invoice = record.transform({
                    fromType: record.Type.SALES_ORDER,
                    fromId: salesOrderId,
                    toType: record.Type.INVOICE
                });

                invoice.setValue({ fieldId: 'trandate', value: new Date(oDate) });

                var invId = invoice.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });
                return invId;
            } catch (error) {
                log.debug('Fail to create Invoice', error);
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