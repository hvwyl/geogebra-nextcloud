(function (OCA) {
	OCA.Geogebra = _.extend({
		AppName: "geogebra",
		context: null,
		scrollHistory:null,
		folderUrl: null,
		iframeDom: null
	}, OCA.Geogebra);

	// 文件点击监听方法
	OCA.Geogebra.FileClick = function (fileName, context) {
        var fileInfoModel = context.fileInfoModel || context.fileList.getModelForFile(fileName);
		var fileId = context.fileId || fileInfoModel.id;

        OCA.Geogebra.OpenEditor(fileId, context.dir, fileName);

        OCA.Geogebra.context = context;
        OCA.Geogebra.context.fileName = fileName;
	};
	// 打开编辑器方法
	OCA.Geogebra.OpenEditor = function (fileId, fileDir, fileName) {
        var filePath = "";
        if (fileName) {
            filePath = fileDir.replace(new RegExp("\/$"), "") + "/" + fileName;
        }

        if ($("#isPublic").val()) {
            url = OC.generateUrl("/apps/" + OCA.Geogebra.AppName + "/vendor/classic.html?t={shareToken}&fileId={fileId}&filePath={filePath}",
            {
                shareToken: encodeURIComponent($("#sharingToken").val()),
				fileId: fileId,
				filePath: filePath
            });
		}else{
			var url = OC.generateUrl("/apps/" + OCA.Geogebra.AppName + "/vendor/classic.html?fileId={fileId}&filePath={filePath}",
            {
                fileId: fileId,
                filePath: filePath
			});
		}

		OCA.Geogebra.scrollHistory={};
		OCA.Geogebra.scrollHistory.x=window.scrollX;
		OCA.Geogebra.scrollHistory.y=window.scrollY;

		OCA.Geogebra.iframeDom=$(`<iframe style="background-color:#fff;width:100%;height:calc(100vh - 50px);display:block;position:absolute;top: 0;z-index:1010;" src="${url}" scrolling="no" sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-modals allow-top-navigation allow-presentation" allowfullscreen="true"/>`);

		$("#app-content").append(OCA.Geogebra.iframeDom);
		$("body").addClass("geogebra-inline");

		if (OCA.Files.Sidebar.file!='') {
			OCA.Files.Sidebar.open(filePath);
		}else{
			OCA.Files.Sidebar.close();
		}

		OCA.Geogebra.folderUrl = location.href;
        window.history.pushState(null, null, location.href.split("?")[0]+`?dir=${fileDir}&openfile=${fileId}`);
	};
	// 关闭编辑器方法
	OCA.Geogebra.CloseEditor = function () {
		OCA.Geogebra.iframeDom.remove();
        OCA.Geogebra.iframeDom = null;

        $("body").removeClass("geogebra-inline");

		window.scrollTo(OCA.Geogebra.scrollHistory.x,OCA.Geogebra.scrollHistory.y);
		OCA.Geogebra.scrollHistory=null;
	
		OCA.Geogebra.context = null;

		var url = OCA.Geogebra.folderUrl;
        if (!!url) {
            window.history.pushState(null, null, url);
            OCA.Geogebra.folderUrl = null;
        }
    };
	// 注册文件操作方式
	OCA.Geogebra.registerAction =  function() {
		OCA.Files.fileActions.registerAction({
			name: "geogebraClassic",
			displayName: t(OCA.Geogebra.AppName, "Open in Geogebra Classic"),
			mime: ["application/ggb"],
			permissions: OC.PERMISSION_READ,
			iconClass: "icon-rename",
			actionHandler: OCA.Geogebra.FileClick
		});
		
		OCA.Files.fileActions.setDefault(["application/ggb"], "geogebraClassic");
	}
	
	// 注册新建文件菜单
	OCA.Geogebra.NewFileMenu = {
		attach: function(menu) {
			var fileList = menu.fileList;

			if (fileList.id !== "files" && fileList.id !== "files.public") {
                return;
            }

			menu.addMenuEntry({
				id: "geogebra",
				displayName: t(OCA.Geogebra.AppName, "New GGB file"),
				templateName: t(OCA.Geogebra.AppName, "New file.ggb"),
				iconClass: "icon-geogebra-new-ggb",
				fileType: "application/ggb",
				actionHandler: function(name) {
					var dir = fileList.getCurrentDirectory();
					fileList.createFile(name).then(function() {
						// alert("new file created");
					});
				}
			});
		}
	}

	OC.Plugins.register("OCA.Files.NewFileMenu", OCA.Geogebra.NewFileMenu);
	OCA.Geogebra.registerAction();

	// 共享文件预览部分
	$(document).ready(function(){
		if ($("#isPublic").val() && $("#mimetype").val()=="application/ggb") {
			OCA.Geogebra.OpenEditor(0,"/",$("#filename").val());
		}
	});

})(OCA);