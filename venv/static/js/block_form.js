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

    function close_submit_inform() {
        $("#submit_inform").fadeOut("slow")
    }

    function submit_inform_open(msg, flag) { // 1 means successful, 0 means failed
        if (flag === "1"){
            $("#submit_inform_tmpl").addClass("alert-success");
            $("#submit_inform_tmpl").removeClass("alert-danger");

        }
        else if (flag === "0"){
            $("#submit_inform_tmpl").addClass("alert-danger");
            $("#submit_inform_tmpl").removeClass("alert-success");
        }
        $("#submit_form_msg").html(msg);
        // $("#submit_inform").css("display", "block");
        $("#submit_inform").fadeIn("fast");
        setTimeout(close_submit_inform, 6000);
    }

    function submitRecordForm() {
        $.ajax(
            {
                url: "/submit_record_form",
                type: "POST",
                data: {
                    "Title": $("#nameOfBlock").val(),
                    "DsubmitRecordFormescription": $("#descriptionOfBlock").val(),
                    "Tags": collectTags(),
                    "Date": $("#dateOfBlock").val()
                },
                dataType: "json",
                // contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    if (data["msg"] == 1) {
                        // alert("Record suc.");
                        submit_inform_open("<strong>Successfully submit!</strong>&nbsp;&nbsp;The information is sent to the server.\n", "1");
                    } else {
                        // alert("Record unsuccessfully.");
                        submit_inform_open("<strong>Submit failed!</strong>&nbsp;&nbsp;The information cannot be sent to the server.\n", "0");
                    }
                },
                error: function (e) {
                    // alert("Record error.");
                    submit_inform_open("<strong>Submit failed!</strong>&nbsp;&nbsp;The information cannot be sent to the server.\n", 0);
                }
                // ,complete: function (data) {
                //     alert("Record suc.");
                //     alert(data);
                //     submit_inform_open("<strong>Successfully submit!</strong>&nbsp;&nbsp;The information is sent to the server.\n", 1);
                // }
            }
        )
        // alert("aaa");

    }


    $("#record_form_form").submit(function () {
        submitRecordForm();
        $("#record_form_form").each(function(){ this.reset() });
        $("div.bootstrap-tagsinput span").remove();
    });
});