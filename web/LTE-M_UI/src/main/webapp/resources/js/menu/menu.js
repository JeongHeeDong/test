$(document).ready(function (){
	var menuDraw = '';
	var level = menuList[0].LEVEL;
	var remark = '';

	$(menuList).each(function (idx, value) {
		menuDraw = '';
		var menuUri = value.MENU_URI;
		var level = Number(value.LEVEL);
		var childYn = value.CHILD_YN;
		var menuId = value.MENU_ID;
		var pId = value.PARENT_ID;
		var childTree = '';

		if(childYn === 'Y') {
			childTree = '<ul class="mu-list ul-menu-' + menuId + '"></ul>';
		}

		if(level === 0) {
			//대메뉴
			menuDraw =
				'<li class="li-menu-' + menuId + '">' +
					//'<a href="' + value.MENU_URI + '">' +
						'<a style="cursor:pointer;" data-id="' + menuId + '" data-parent="' + value.PARENT_ID + '"'
						+ (menuUri == '' ? '' : 'data-url="'+menuUri+'"')
						+' data-name="' + value.MENU_NAME + '">' +
						'<i class="mu-icon-img ' + value.MENU_ICON + '"></i>' +
						'<span>' + value.MENU_NAME +  '</span>' +
					'</a>' +
					childTree +
				'</li>';

			$('.mu-hMenu').append(menuDraw);

		} else {
			var uri = '';

			if(value.MENU_URI) {
				if(value.MENU_URI.substr(value.MENU_URI.length - 2, 2) === '()') {
				//if(value.MENU_URI.endsWith('()')) {
					uri =
						'<a uri="' + value.MENU_URI + '" onclick="' + value.MENU_URI + '" data-id="' + menuId + '" data-parent="' + value.PARENT_ID + '" data-name="' + value.MENU_NAME + '">' +
						'<span>' + value.MENU_NAME + '</span></a>';
				} else {
					uri =
						'<a uri="' + value.MENU_URI + '" data-id="' + menuId + '" data-parent="' + value.PARENT_ID + '" data-name="' + value.MENU_NAME + '">' +
						'<span>' + value.MENU_NAME + '</span></a>';
				}
			} else {
				uri =
					'<a style="cursor:pointer;" data-id="' + menuId + '" data-parent="' + value.PARENT_ID + '" data-name="' + value.MENU_NAME + '">' +
					'<span>' + value.MENU_NAME + '</span></a>';
			}

			menuDraw =
				'<li class="li-menu-' + menuId + '">' +
					uri +
					childTree +
				'</li>';

			$('.ul-menu-' + pId + ':last-child').append(menuDraw);
		}
	});


	$('.mu-hMenu').on('click', 'li', function (evt) {
		
		var url = $(evt.target).closest('a').data('url');
		if(url != null){
			location.href = url;
			return;
		}
		
		var menuClass = $(this).attr('class');
		evt.stopPropagation();

		var tmp = document.querySelectorAll('.' + menuClass + ' a');
		var uri = '';
		for(var i = 0, len = tmp.length; i < len; i += 1) {
			if(tmp[i].hasAttribute('uri')) {
				uri = tmp[i].getAttribute('uri');
				//if(uri.endsWith('()')) {
				//	tmp[i].removeAttribute('href');
				//}
				break;
			}
		}

		var menuId = '';
		var parentId = '';
		var menuName = '';
		var menuPath = '';

		for(var j = 0, menuLength = menuList.length; j < menuLength; j += 1) {
			if(menuList[j].MENU_URI === uri) {
				menuId = menuList[j].MENU_ID;
				menuName = menuList[j].MENU_NAME;
				parentId = menuList[j].PARENT_ID;
				break;
			}
		}

		menuPath = ' | ' + menuName;
		menu.menuRecur(menuPath, parentId);
		document.getElementById('menu-path').value = menu.menuPath;
		document.getElementById('menu-title').value = menuName;
		document.getElementById('page-title').value = "LTE-M | " + menu.menuPath;
		document.getElementById('menu-id').value = menuId;

		document.menuForm.target = '';

		if(uri.substr(uri.length - 2, 2) === '()') {
		//if(uri.endsWith('()')) {
			window[uri.substr(0, uri.length - 2)]();
		} else {
			document.menuForm.action = uri;
			document.menuForm.submit();
		}
	});
});

menu = {
	menuPath: '',

	menuRecur: function (path, parent) {
		var menuPath = '';
		var menuName = '';
		var parentId = '';

		for(var i = 0, menuLength = menuList.length; i < menuLength; i += 1) {
			if(menuList[i].MENU_ID == parent) {
				menuName = menuList[i].MENU_NAME;
				parentId = menuList[i].PARENT_ID;

				if(parentId != '0') {
					menuPath = ' | ' + menuName;
					menu.menuPath = menuPath + path;
					menu.menuRecur(menu.menuPath, parentId);
				} else {
					menuPath = menuName;
					menu.menuPath = menuPath + path;
				}
				break;
			}
		}
	}
};
