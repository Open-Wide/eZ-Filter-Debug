(function () {

    // Add the debug stylesheet
    var is_debug_stylesheet_loaded = false;
    for (i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href) {
            if (document.styleSheets[i].href.replace(/^.*[\/\\]/g, '') == 'debug.css') {
                is_debug_stylesheet_loaded = true;
            }
        }
    }
    if (!is_debug_stylesheet_loaded) {
        var e = document.createElement('link');
        e.setAttribute('type', 'text/css');
        e.setAttribute('media', 'screen');
        e.setAttribute('rel', 'stylesheet');
        e.setAttribute('href', '/design/standard/stylesheets/debug.css');
        document.body.appendChild(e);
    }

    // Remove the debug header
    var debug_toolbar_element = document.getElementsByClassName('debug-toolbar');
    if (debug_toolbar_element.length > 0) {
        debug_toolbar_element = debug_toolbar_element[0];
        var debug_header_element = debug_toolbar_element.parentNode.parentNode;
        debug_header_element.parentNode.removeChild(debug_header_element);
    }


    // Function that add a class name to identify the different type of debug content
    var get_marker_from_span_content = function (span_content) {
        return 'debug_filter_' + span_content.toLowerCase();
    }


    // Function that add a class name to identify the different type of debug content
    var add_debug_filter_marker = function (element, marker) {
        if (element !== null) {
            var filter_className = 'debug_filter_item';
            var index_of = -1;
            if (element.className) {
                index_of = element.className.indexOf(filter_className);
            }
            if (index_of == -1) {
                element.className += ' ' + filter_className + ' ' + marker;
            }
        }
    }

        // Re factor the debug table
    var debug_element = document.getElementById('debug');
    if (debug_element !== null) {
        debug_element.style.display = 'block';
        debug_element.style.marginBottom = screen.height + 'px';
        var table_element = debug_element.getElementsByTagName('table');
        if (table_element.length > 0) {
            table_element = table_element[0];
            table_element.style.width = '100%';
            var table2_element = table_element.getElementsByTagName('table');
            if (table2_element.length > 0) {
                table_element = table2_element[0];
            }
            var debug_filters = {};
            var tr_elements = table_element.getElementsByTagName('tr');
            if (tr_elements.length > 0) {

                // Add marker on the rows
                var td_elements, span_elements, span_content, tr_filter_custom_className, index_of;
                for (var i = 0; i < tr_elements.length; i++) {
                    td_elements = tr_elements[i].getElementsByClassName('debugheader');
                    if (td_elements.length > 0) {
                        span_elements = td_elements[0].getElementsByTagName('span');
                        if (span_elements.length > 0) {
                            span_content = span_elements[0].innerHTML;
                            span_content = span_content.substr(0, span_content.length - 1);
                            var marker = get_marker_from_span_content(span_content);
                            add_debug_filter_marker(tr_elements[i++], marker);
                            add_debug_filter_marker(tr_elements[i], marker);
                            if (!debug_filters.hasOwnProperty(span_content)) {
                                debug_filters[span_content] = {
                                    marker: marker,
                                    count: 1
                                };
                            } else {
                                debug_filters[span_content].count++;
                            }
                        }
                    }
                }

                // Add a header to filter the debug informations
                var ths = table_element.getElementsByTagName('th')
                if (ths.length == 0) {
                    var tr = document.createElement('tr');
                    tr_elements[0].parentNode.insertBefore(tr, tr_elements[0]);
                    var th = document.createElement('th');
                    th.style.padding = '5px 5px 15px';
                    th.setAttribute('colspan', 2);
                    th.innerHTML = 'Filtered display : ';
                    tr.appendChild(th);
                    var select = document.createElement('select');
                    select.setAttribute('id', 'debug_filter');
                    var option = document.createElement('option');
                    option.innerHTML = 'All';
                    option.setAttribute('value', 'debug_filter_item');
                    select.appendChild(option);
                    select.onchange = function (event) {
                        var select = event.target;
                        var debug_filter_items = document.getElementsByClassName('debug_filter_item');
                        if (debug_filter_items.length > 0) {
                            for (var i = 0; i < debug_filter_items.length; i++) {
                                if (debug_filter_items[i].className.indexOf(select.value) == -1) {
                                    debug_filter_items[i].style.display = 'none';
                                } else {
                                    debug_filter_items[i].style.display = '';
                                }
                            }
                        }
                    };
                    th.appendChild(select);
                    for (var i in debug_filters) {
                        if (debug_filters.hasOwnProperty(i)) {
                            var option = document.createElement('option');
                            option.innerHTML = i + ' (' + debug_filters[i].count + ')';
                            option.setAttribute('value', debug_filters[i].marker);
                            select.appendChild(option);
                        }
                    }
                }
            }
        }
    }

    // Let's go !
    window.location.hash = '#debug';

})();
