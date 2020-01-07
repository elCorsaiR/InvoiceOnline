$(document).ready(function () {
    $('#invoice_date').attr('placeholder', Date().split(' ').splice(1, 3).join(' '));
    $('#due_date').attr('placeholder', Date().split(' ').splice(1, 3).join(' '));

    appendItem();
    appendItem();
    appendItem();
    updateSubTotal();

    $("#append_item_button").on("click", function () {
        appendItem();
    });

    var items = $('#items');
    items.on('blur', '.quantity', function () {
        updateItemTotal($(this));
    });
    items.on('blur', '.unit_price', function () {
        updateItemTotal($(this));
    });
    items.on('click', '.delete-button', function () {
        removeLineItem(this);
    });
    showDeleteButton(this);

    $('#tax').on('blur', function () {
        updateTaxAndTotal(this);
    });
});

appendItem = function () {
    var last_item_id = $('#items > tr:last').attr("id");
    var underscore_position = last_item_id.lastIndexOf("_");
    var index = Number(last_item_id.substring(underscore_position + 1));
    if (isNaN(index)) {
        index = 0;
    }
    index += 1;

    var itemId = "item_" + index;
    var newRow = $("#rowTemplate").clone();
    newRow.attr("id", itemId).removeClass("hide");
    updateIds(newRow, index);
    newRow.appendTo("#items");
    updateTabIndex(index);
};

updateIds = function (element, index) {
    var children = $(element).children();
    var children_count = children.length;
    var tab_index = Number($("#unit_price_" + (index - 1)).attr("tabindex")) + 1;
    for (var i = 0; i < children_count; i++) {
        updateIds(children[i], index);
        var tag_name = $(children[i]).prop("tagName");
        if (tag_name === "INPUT" || tag_name === "BUTTON" || tag_name === "TD") {
            if ($(children[i]).attr("id") === undefined) {
                continue;
            }
            var underscore_position = $(children[i]).attr("id").lastIndexOf("_");
            id_name = $(children[i]).attr("id").substring(0, underscore_position);
            elementId = id_name + "_" + index;
            $(children[i]).attr("id", elementId);
            $(children[i]).attr("name", elementId);
            if ($(children[i]).attr("tabindex") !== undefined) {
                $(children[i]).attr("tabindex", tab_index)
            }
        }
    }
};

updateTabIndex = function (element) {
    var tab_index = $("#unit_price_" + element).attr("tabindex") + 1;
    $("#tax").attr("tabindex", tab_index);
    $("#terms").attr("tabindex", tab_index + 1);
};

updateItemTotal = function (element) {
    var underscore_position = $(element).attr("id").lastIndexOf("_");
    var index = $(element).attr("id").substring(underscore_position + 1);
    var total = "0.00";
    if (isNaN($("#quantity_" + index).val())) {
        $("#quantity_" + index).val("1.00")
    } else if (isNaN($("#unit_price_" + index).val())) {
        $("#unit_price_" + index).val("0.00")
    }
    var quantity = Number($("#quantity_" + index).val());
    var price = Number($("#unit_price_" + index).val());
    total = (quantity * price).toFixed(2);
    $("#total_" + index).html(total);
    updateSubTotal();
};

updateSubTotal = function () {
    var sum = Number(0);
    var line_total = "0.00";
    var item_total_element = "";

    var last_item_id = $('#items > tr:last').attr("id");
    var underscore_position = last_item_id.lastIndexOf("_");
    var index = Number(last_item_id.substring(underscore_position + 1));
    if (isNaN(index)) {
        index = 0;
    }
    for (var i = 1; i <= index; i++) {
        item_total_element = $("#total_" + i);
        if (item_total_element === null || isNaN(item_total_element.html())) {
            continue
        }
        line_total = Number(item_total_element.html());
        sum = sum + line_total
    }
    sum = sum.toFixed("2");
    $("#sub_total").html(sum);
    updateTaxAndTotal();
};

updateTaxAndTotal = function () {
    var sub_total = $("#sub_total").html();
    var tax_value = $("#tax").val();
    var tax = tax_value !== null ? tax_value[0] / 100 : 0;
    var tax_amount = tax * sub_total;
    $("#tax_amount").html(tax_amount.toFixed(2));
    var total = Number(sub_total) + Number(tax_amount);
    total = total.toFixed(2);
    $("#total").html(total)
};

removeLineItem = function (element) {
    var underscore_position = $(element).attr("id").lastIndexOf("_");
    var index = $(element).attr("id").substring(underscore_position + 1);
    var items_count = $("#items").children().length;
    if ((items_count - 1) > 1) {
        $("#item_" + index).remove();
    }
    updateSubTotal()
};

showDeleteButton = function (elementId) {
    var n = $(elementId).find(".delete-button");

    n.removeClass("hide").addClass("show");
};

hideDeleteButton = function (elementId) {
    var n = $(elementId).find(".delete-button");

    n.removeClass("show").addClass("hide");
};