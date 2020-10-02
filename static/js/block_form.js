// $('#datepicker').datepicker();
// $('#datepicker').on('changeDate', function () {
//     $('#my_hidden_input').val(
//         $('#datepicker').datepicker('getFormattedDate')
//     );
//
// });

//////////////// Var /////////////////////
let if_showing_blocks = 0; // 1 is showing, 0 is not
let if_showing_tags = 1; // 1 is showing, 0 is not


$(function () {
    /////////////////////////////////////////////
    function collectTags() {
        let tag_arr = [];
        const tag_span_arr = $("#tags_and_date div.bootstrap-tagsinput span");
        const span_num = tag_span_arr.length;
        for (let i = 0; i < span_num; i++) {
            if (tag_span_arr[i].innerText !== "") {
                tag_arr.push(tag_span_arr[i].innerText);
            }
        }
        return JSON.stringify(tag_arr);
    }

    function close_submit_inform_msg() {
        $("#submit_inform_msg").fadeOut("slow")
    }

    function submit_inform_msg_open(msg, flag) { // 1 means successful, 0 means failed
        if (flag === "1") {
            $("#submit_inform_tmpl").addClass("alert-success");
            $("#submit_inform_tmpl").removeClass("alert-danger");

        } else if (flag === "0") {
            $("#submit_inform_tmpl").addClass("alert-danger");
            $("#submit_inform_tmpl").removeClass("alert-success");
        }
        $("#submit_form_msg").html(msg);
        $("#submit_inform_msg").fadeIn("fast");
        setTimeout(close_submit_inform_msg, 6000);
    }

    function submitRecordForm() {
        $.ajax(
            {
                url: "/submit_record_form",
                type: "POST",
                data: {
                    "Title": $("#nameOfBlock").val(),
                    "Description": $("#descriptionOfBlock").val(),
                    "Tags": collectTags(),
                    "Date": $("#dateOfBlock").val()
                },
                dataType: "json",
                // contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    if (data["msg"] === 1) {
                        /* clear the form */
                        $("#record_form_form").each(function () {
                            this.reset()
                        });
                        $("div.bootstrap-tagsinput span").remove();
                        /* If now the showing-blocks is turned on, then renew the showing-blocks and the showing-tags. */
                        if (if_showing_blocks === 1) {
                            showBlocksData();
                        }
                        if (if_showing_tags === 1) {
                            showTagsData();
                        }
                        submit_inform_msg_open("<strong>Successfully submit!</strong>&nbsp;&nbsp;The information is sent to the server.\n", "1");
                    } else {
                        // alert("Record unsuccessfully.");
                        submit_inform_msg_open("<strong>Submit failed!</strong>&nbsp;&nbsp;The information cannot be sent to the server.\n", "0");
                    }
                },
                error: function () {
                    // alert("Record error.");
                    submit_inform_msg_open("<strong>Submit failed!</strong>&nbsp;&nbsp;The information cannot be sent to the server.\n", 0);
                }
            }
        )

    }


    $("#record_form_form").submit(function () {
        submitRecordForm();

    });
});

///////////////////// showing blocks //////////////////////////////////
function showBlocksData() {
    let htmlStr = "";
    $.getJSON('/show_blocks', "", function (data) {
        let num = 0; // from 0
        for (block of data) {
            num++;
            let block_id = block[0];
            let title = block[1];
            let description = block[2];
            let date = block[3];
            let tags = block[4];
            // let tagsArr = [];
            /* make html string */
            htmlStr +=
                "<div class=\"card\" id=\"show_blocks_card_" + num + "\">\n" +
                "    <div class=\"card-header\" id=\"heading" + String(num) + "\">" +
                "        <h2 class=\"mb-0\">\n" +
                "            <button class=\"btn btn-link btn-block text-left collapsed\" type=\"button\" data-toggle=\"collapse\" " +
                "                data-target=\"#collapse" + num + "\" aria-expanded=\"true\" aria-controls=\"collapse" + num + "\">" +
                `${title} &nbsp; &nbsp; &nbsp; <a class='blocks_info_date_signs'>${date}</a>`;
            for (let tag of tags) {
                htmlStr += `&nbsp; <a class=\"blocks_info_tags_signs\">(</a><a class=\"blocks_info_tags\">#${tag}</a><a class=\"blocks_info_tags_signs\">)</a>`;
            }
            htmlStr += "</button>\n</h2>\n</div>\n"
                + "<div id=\"collapse" + num + "\" class=\"collapse\" aria-labelledby=\"heading" + num + "\" "
                + "data-parent=\"#show_blocks_section_accordion\">"
                + "<div class=\"card-body\">\n";
            if (description) {
                htmlStr += "<div class='container'><p>" + description + "</p></div>";
            } else {
                htmlStr += "No description.";
            }
            htmlStr += "<div class='container text-right'><button type=\"button\" title='" + block_id + "' class=\"btn btn-danger need_confirm_delete\" id='block_delete_btn_" + num + "'>Delete</button>\n"
            htmlStr += "\n</div>\n</div>\n</iv>\n</div>";
        }
        $("#show_blocks_section_accordion").html(htmlStr);
        /* start to listen to deleting buttons */
        $("button.need_confirm_delete").click(function () {
            if (confirm_delete()) {
                let block_id = $(this).attr('title');
                $.post('/delete_block', {block_id: block_id}, function () {
                    // let msg = `Delete a block. (Block ID is ${block_id}.)`;
                    // alert(msg);
                    showBlocksData();
                }, "json")

            }
        });
    });
}

/* delete button */
function confirm_delete() {
    let msg = 'Confirm deletion?';
    return (confirm(msg) === true)
}

$(function () {
    $("#btn_show_blocks").click(function () {
        showBlocksData();
        if_showing_blocks = 1;
    });

    $("#btn_remove_blocks").click(function () {
        $("#show_blocks_section_accordion").html("");
        if_showing_blocks = 0;
    });


    /////////////// Show tables /////////////////
    $("#showing_table_headerAndTables_container").hide(); // default: hide
    let ifShowingTables = 0;
    $("#btn_show_tables").click(function () {
        if (ifShowingTables === 1) {
            $("#showing_table_headerAndTables_container").hide();
            ifShowingTables = 0;
        } else {
            $("#showing_table_headerAndTables_container").show();
            ifShowingTables = 1;
        }
    });
});

///////////////// Show tags /////////////////////
function randSelectBtnClass() {
    let ifSelectRandSuccess = 0; // 1 means having chosen\
    let classStr;
    // get a random num
    let randNum = 1;
    while (ifSelectRandSuccess === 0) {
        randNum = Math.floor(Math.random() * 10);
        // choose 1~8
        if (randNum >= 1 && randNum <= 8) {
            ifSelectRandSuccess = 1;
        }
    }
    // choose class string based on the random num
    switch (randNum) {
        case 1:
            classStr = "badge-primary";
            break;
        case 2:
            classStr = "badge-secondary";
            break;
        case 3:
            classStr = "badge-success";
            break;
        case 4:
            classStr = "badge-danger";
            break;
        case 5:
            classStr = "badge-warning";
            break;
        case 6:
            classStr = "badge-info";
            break;
        case 7:
            classStr = "badge-light";
            break;
        case 8:
            classStr = "badge-dark";
            break;
        default:
            classStr = "badge-primary";
            break;
    }
    return classStr;
}


function showTagsData() {
    let tags_htmlStr = "";
    $.getJSON('/get_tags', "", function (data) {
            let num = 0; // from 0
            for (tags of data) {
                num++;
                let tag_id = tags[0];
                let name = tags[1];
                /* make html string */
                let classStr = randSelectBtnClass();
                tags_htmlStr +=
                    `<a href="#" class="badge tag_badge_add_tag ${classStr}" id="tagID_${tag_id}">${name}</a>&nbsp;`;


                //     htmlStr +=
                //         "<div class=\"card\" id=\"show_blocks_card_" + num + "\">\n" +
                //         "    <div class=\"card-header\" id=\"heading" + String(num) + "\">" +
                //         "        <h2 class=\"mb-0\">\n" +
                //         "            <button class=\"btn btn-link btn-block text-left collapsed\" type=\"button\" data-toggle=\"collapse\" " +
                //         "                data-target=\"#collapse" + num + "\" aria-expanded=\"true\" aria-controls=\"collapse" + num + "\">" +
                //         `${title} &nbsp; &nbsp; &nbsp; <a class='blocks_info_date_signs'>${date}</a>`;
                //     for (let tag of tags) {
                //         htmlStr += `&nbsp; <a class=\"blocks_info_tags_signs\">(</a><a class=\"blocks_info_tags\">#${tag}</a><a class=\"blocks_info_tags_signs\">)</a>`;
                //     }
                //     htmlStr += "</button>\n</h2>\n</div>\n"
                //         + "<div id=\"collapse" + num + "\" class=\"collapse\" aria-labelledby=\"heading" + num + "\" "
                //         + "data-parent=\"#show_blocks_section_accordion\">"
                //         + "<div class=\"card-body\">\n";
                //     if (description) {
                //         htmlStr += "<div class='container'><p>" + description + "</p></div>";
                //     } else {
                //         htmlStr += "No description.";
                //     }
                //     htmlStr += "<div class='container text-right'><button type=\"button\" title='" + block_id + "' class=\"btn btn-danger need_confirm_delete\" id='block_delete_btn_" + num + "'>Delete</button>\n"
                //     htmlStr += "\n</div>\n</div>\n</iv>\n</div>";
                // }
                $("#second_show_tags_container").html(tags_htmlStr);
                auto_add_tag_on_form_by_clicking();
            }
        }
    );
}

/* add tag on the form by clicking the tag of showing-tags */
function auto_add_tag_on_form_by_clicking() {
    $("#second_show_tags_container .tag_badge_add_tag").click(function () {
        let idStr = $(this).attr("id");
        let addTag = $("#" + idStr).text();
        let tag_span_htmlStr = `<span class="tag label label-info">${addTag}<span data-role="remove"></span></span>`;
        $("#tags_and_date .bootstrap-tagsinput input").before(tag_span_htmlStr);
    })
}

$(function () {

    $("#btn_show_tags").click(function () {
        showTagsData();
        if_showing_tags = 1;
    });

    $("#btn_hide_show_tags").click(function () {
        $("#second_show_tags_container").html("");
        if_showing_tags = 0;
    });


    /* show tags initially */
    showTagsData();


    /////////////////////////////////////////////


});


//////////////// testing area /////////////////////


// $(document).ready(function () {
//     $("#btn_remove_blocks").click(function () {
//         $('.toast').toast('show');
//     });
// });
