window.addEventListener("resize", pageLoad);

window.onload = pageLoad();

/**
 * 页面加载函数
 */
function pageLoad() {
    // loadResumeHead();
    loadotherInfo();
    loadAnimation();
    
    bodyLoad();
}

/**
 * body自动计算高度并设置垂直自动滚动
 */
function bodyLoad() {
    let bodyHeight = window.innerHeight - 320;
    document.getElementById("bodyGrid").style.height = bodyHeight + "px";
    document.getElementById("bodyGrid").style.overflowY = "auto";
    document.getElementById("content").style.left = (window.innerWidth - 1024) / 2;
};

/**
 * 加载背景动画
 */
function loadAnimation() {
    let update = function () {
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

/**
 * 加载简历头部
 */
function loadResumeHead() {
    document.getElementById("content").innerHTML = generHead();
}

/**
 * 加载除头部外其他信息
 */
function loadotherInfo() {
    let str = generHead();
    str += '<div id="bodyGrid" class="body-grid">';
    str += generSpecialInfo(resumeData.otherInfo.dataInfo.selfAdv, false, "color:#000");
    //获取技能信息
    str += generNormalPlanInfo(resumeData.otherInfo.dataInfo.technical, true, true, false);
    //获取期望信息
    str += generNormalPlanInfo(resumeData.otherInfo.dataInfo.expect, true, true, false);
    //获取工作经历信息
    str += generNormalPlanInfo(resumeData.otherInfo.dataInfo.worker, true, true, true);
    //获取项目经历信息
    str += generNormalPlanInfo(resumeData.otherInfo.dataInfo.project, true, true, true);
    //获取教育经历
    str += generNormalPlanInfo(resumeData.otherInfo.dataInfo.education, true, true, false);
    str += '</div>';
    document.getElementById("content").innerHTML = str;
}

/**
 * 生成简历头部代码
 * @returns 
 */
function generHead() {
    let selfInfo = resumeData.selfInfo;
    let str = '<div class="head-grid"><span class="self-resume">个人简历</span><div class="plan-row"><div class="plan-title"><span>基本信息</span></div><div class="plan-body" id="ResumeHead">';
    str += generColRow(selfInfo.name, false, 1, "font-size: 24px;");
    let strappend = '<hr />';
    let dynamicGrid = gridConvert(selfInfo.dataInfo.grid);
    for (let i = 0, len = selfInfo.dataInfo.otherdata.length; i < len; i++) {
        if (i % 3 === 0 && i != 0) {
            strappend += '<hr />';
        }
        strappend += generColRow(selfInfo.dataInfo.otherdata[i], false, dynamicGrid[0], "")
    }
    str = str += strappend;
    str += '</div></div></div>';
    return str;
}

/**
 * 生成常规信息，如：技能、期望、工作、项目······
 * @param {*} data 数据源
 * @param {*} openHr 是否开始<hr/>标签
 * @param {*} openTitleBold 是否开启标题加粗
 * @param {*} openTitleMore 是否开启项目经历
 * @returns 
 */
function generNormalPlanInfo(data, openHr, openTitleBold, openTitleMore) {
    let customStyle = openTitleBold === true ? "font-weight: bolder;font-size: 16px;" : "";
    let str = '<div class="plan-row">';
    let planHead = '<div class="plan-title"><span>' + data.title + '</span></div>';
    let planBody = '<div class="plan-body">';
    let dynamicGrid = [];
    for (let i = 0, len = data.data.length; i < len; i++) {
        dynamicGrid = gridConvert(data.grid);
        planBody += '<div class="plan"><div class="plan-body-title"><div class="col-rows-1"><span style="' + customStyle + '">' + data.data[i].title + '</span></div>';
        if (openTitleMore) {
            planBody += '<div class="col-rows-' + (dynamicGrid.length > 1 ? dynamicGrid[0] : 1) + '"><span style="' + customStyle + '">' + data.data[i].moreLeft + '</div><div class="col-rows-' + (dynamicGrid.length > 1 ? dynamicGrid[1] : 1) + '"><span style="' + customStyle + '">' + data.data[i].moreRight + '</span></div>';
        }
        planBody += '</div><div class="plan-body">';
        let childer = data.data[i].data;
        dynamicGrid = gridConvert(data.data[i].grid);
        for (let k = 0, length = childer.length; k < length; k++) {
            planBody += '<div class="col-rows-' + dynamicGrid[0] + '"><span>' + childer[k] + '</span></div>'
        }
        planBody += "</div></div>";
        planBody += openHr === true ? i === len - 1 ? '' : '<hr />' : '';
    }
    planBody += '</div>';
    str += planHead;
    str += planBody;
    str += '</div>';
    return str;
}

/**
 * 生成个人优势
 * @param {*} data 数据源
 * @param {*} indet 独立样式
 * @param {*} spanOtherStyle span标签自定义样式
 */
function generSpecialInfo(data, indet, spanOtherStyle) {
    let bodyData = data.data;
    let str = '<div class="plan-row">'
    let planHead = '<div class="plan-title"><span>' + data.title + '</span></div>';
    let planBody = '<div class="plan-body">';
    let dynamicGrid = gridConvert(data.grid);
    for (let i = 0, len = bodyData.length; i < len; i++) {
        planBody += generColRow(bodyData[i], indet, dynamicGrid[0], spanOtherStyle);
    }
    planBody += '</div>';
    str += planHead;
    str += planBody;
    str += '</div>';
    return str;
}

/**
 * 生成行数据
 * @param {*} content span内容
 * @param {*} indet 是否开启首行缩进
 * @param {*} grid 栅格布局，包含1,2,3
 * @param {*} otherStyle 其他自定义样式
 * @returns 
 */
function generColRow(content, indet, grid, spanOtherStyle) {
    let openIndet = indet === true ? "text-indet" : "";
    return '<div class="col-rows-' + grid + '"><span class="' + openIndet + '" style="' + spanOtherStyle + '">' + content + '</span></div>';
}

/**
 * 栅格转义
 * @param {*} str 要转义的栅格定义
 * @returns 
 */
function gridConvert(str) {
    switch (str) {
        case "-":
            return [1];
        case "1|1|1":
            return [3];
        case "1|2":
            return [3, 4];
        case "2|1":
            return [4, 3];
        case "2|2":
            return [2, 2];
        default:
            return [1];
    }
}

function print() {
    let height = 320;
    let planRows = document.querySelector(".body-grid").children;
    for (let i = 0, len = planRows.length; i < len; i++) {
        height += (planRows[i].offsetHeight + 20);
    }
    document.querySelector(".body-grid").style.height = "auto";
    console.log(height);
    html2canvas(document.getElementById("content"),
        { height: height }
    ).then(canvas => {
        let mywindos = window.open("打印窗口", "_bank");
        mywindos.document.body.appendChild(canvas);
        mywindos.focus();
        mywindos.print();
        mywindos.close();
        bodyLoad();
    })
}

