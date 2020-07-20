/////////////// Show tags data in the beginning ////////////
$(function () {
    showTagsData_search("")
})


///////////// button of add, rename, delete /////////////
$(function () {
    /* btn of show & hide tags-adding */
    let ifShowingTagsAdding = 0
    $("button#btn_tags_adding").click(function () {
        if (ifShowingTagsAdding) {
            $("#add_tags_form").fadeOut(100)
            ifShowingTagsAdding = 0
        } else {
            $("#add_tags_form").fadeIn(100)
            ifShowingTagsAdding = 1
        }
    })
})

/* This function is to get the result of the query. */
function showTagsData_search(keyword) {
    let search_tagsHtmlStr = ""
    // if(!keyword){
    //     keyword=""
    // }
    $.getJSON('/get_tags', {"Keyword": keyword}, function (data) {
            let num = 0; // from 0
            for (tags of data) {
                num++;
                let tag_id = tags[0];
                let name = tags[1];
                /* make html string */
                // let classStr = randSelectBtnClass();
                let classStr = "badge-light"
                search_tagsHtmlStr +=
                    `<a href="#" class="badge tag_badge_add_tag ${classStr} search_tags_class" id="tagID_${tag_id}" draggable="true">${name}</a>&nbsp;&nbsp;&nbsp;`;

                $("#show_search_tags_container").html(search_tagsHtmlStr);
                // auto_add_tag_on_form_by_clicking();
            }
        }
    )
}

/* based on words the user typed to search right away */
$(function () {
    $("#searchingTagsInput").on("input", function () {
            let inputStr = $("#searchingTagsInput").val()
            showTagsData_search(inputStr)
        }
    )
})

/* When submitting adding-a-tag, add a tag. */
$(function () {
    $("#add_tags_form_form").submit(function () {
        
    })
})





