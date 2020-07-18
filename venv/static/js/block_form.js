$(function () {
    $('#datepicker').datepicker();
    $('#datepicker').on('changeDate', function () {
        $('#my_hidden_input').val(
            $('#datepicker').datepicker('getFormattedDate')
        );

    });

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
                    if (data["msg"] == 1) {
                        // alert("Record suc.");
                        submit_inform_msg_open("<strong>Successfully submit!</strong>&nbsp;&nbsp;The information is sent to the server.\n", "1");
                    } else {
                        // alert("Record unsuccessfully.");
                        submit_inform_msg_open("<strong>Submit failed!</strong>&nbsp;&nbsp;The information cannot be sent to the server.\n", "0");
                    }
                },
                error: function (e) {
                    // alert("Record error.");
                    submit_inform_msg_open("<strong>Submit failed!</strong>&nbsp;&nbsp;The information cannot be sent to the server.\n", 0);
                }
            }
        )

    }


    $("#record_form_form").submit(function () {
        submitRecordForm();
        $("#record_form_form").each(function () {
            this.reset()
        });
        $("div.bootstrap-tagsinput span").remove();
    });

    ///////////////////// showing blocks ///////////////////////////////////
    $("#btn_show_blocks").click(function () {
        $.getJSON('/show_blocks', "", function (data) {
            let htmlStr = "";
            let num = 0; // from 0
            for (block of data) {
                num++;
                let title = block[0];
                let description = block[1];
                let date = block[2];
                let tags = block[3];
                let tagsArr = [];
                // console.log(typeof title);
                // console.log(typeof description);
                // console.log(typeof date);
                // console.log(typeof tags);
                // console.log(typeof tagsArr);
                // console.log(typeof data);
                /* make html string */
                htmlStr += "<div class=\"card\">\n<div class=\"card-header\" id=\"heading" + String(num) + "\">"
                    + "<h2 class=\"mb-0\">\n" + "<button class=\"btn btn-link btn-block text-left collapsed\" type=\"button\" data-toggle=\"collapse\" "
                    + "data-target=\"#collapse" + num + "\" aria-expanded=\"true\" aria-controls=\"collapse" + num + "\">"
                    + title + "&nbsp;" + "&nbsp;";
                for (let tag of tags) {
                    htmlStr += "&nbsp;" + "<a class=\"blocks_info_tags_signs\">" + "(</a>" + "<a class=\"blocks_info_tags\">#" + tag + "</a><a class=\"blocks_info_tags_signs\">)</a>";
                }
                htmlStr += "</button>\n</h2>\n</div>\n"
                    + "<div id=\"collapse" + num + "\" class=\"collapse\" aria-labelledby=\"heading" + num + "\" "
                    + "data-parent=\"#show_blocks_section_accordion\">"
                    + "<div class=\"card-body\">\n";
                if (description) {
                    htmlStr += description;
                } else {
                    htmlStr += "No description.";
                }
                htmlStr += "\n</div>\n</div>\n</div>";
                console.log(description)
            }
            $("#show_blocks_section_accordion").html(htmlStr);
        });
        $('.collapse').collapse();
    });

});