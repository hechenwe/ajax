 
function Free() {
};
 
/**
 * 替换
 *@param listId
 *            list标签类的Id
 * @param data
 *            List 类型的数据对象
 */
Free.prototype.replace = function (listId,data){
	var list = $("list[id='"+listId+"']");
	var html = this.getHtml(list.html(), data);
	list.replaceWith(html); 
}

/**
 * 
 * @param listHtml
 *            list标签类的Html内容
 * @param data
 *            List 类型的数据对象
 * @returns {String} 可用的html片段
 */
Free.prototype.getHtml = function(listHtml, data) {
	var xml = "<xml>" + listHtml + "</xml>";  //转换成xml字符串 处理
	var xmlChildren = $(xml).children();

	var if_e = $(xml).find("if");
	var else_e = $(xml).find("else");

	var ifHtml = "";
	var elseHtml = "";

	for (var k = 0; k < xmlChildren.length; k++) {
		var localName = xmlChildren[k].localName;
		if (localName == "if") {
			ifHtml = ifHtml + xmlChildren[k].innerHTML;
		} else if (localName == "else") {
			elseHtml = elseHtml + xmlChildren[k].innerHTML;
		} else {
			elseHtml = elseHtml + xmlChildren[k].outerHTML;
			ifHtml = ifHtml + xmlChildren[k].outerHTML;
		}

	}

	var list_html = "";
	if ( if_e.length == 1) { // 存在if节点
		var exp = if_e.attr("exp");
		var key = exp.split("==")[0];
		for (var j = 0; j < data.size(); j++) {
			var map = data.get(j);
			var array = map.keySet()
			var key2 = key.substring(2, key.length - 1);
			var value = map.get(key2);
			var expString = exp.replace(key, value);
			var ifTemp = ifHtml;
			var elseTemp = elseHtml;
			if (eval(expString)) { // 表达式成立

				for ( var i in array) {
					ifTemp = ifTemp.split("${" + array[i] + "}").join(map.get(array[i]));
				}
				list_html = list_html + ifTemp;

			} else {
				for ( var i in array) {
					elseTemp = elseTemp.split("${" + array[i] + "}").join(map.get(array[i]));
				}
				list_html = list_html + elseTemp;

			}
		}

	} else { // 没有if节点
		for (var j = 0; j < data.size(); j++) {
			var map = data.get(j);
			var array = map.keySet()
			var tempHtml = ifHtml;
			for ( var i in array) {
				tempHtml = tempHtml.split("${" + array[i] + "}").join(map.get(array[i]));
			}
			list_html = list_html + tempHtml;
		}
	}
	return list_html;
};
