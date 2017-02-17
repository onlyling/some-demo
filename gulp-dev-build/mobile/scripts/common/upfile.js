/*
 *上传附件
 *
 *updata 2015.12.30 sanmiao
 */
define(function(require, exports, module) {
	$('.upfile').each(function(index, el) {
		var _upfile = $(this);
		_upfile.on('change', 'input.file', function() {
			$.showPreloader('上传中..');
			var _this = $(this);
			if (!_this[0].files[0]) {
				$.hidePreloader();
				return;
			}
			var oMyForm = new FormData();
			oMyForm.append('userfile', _this[0].files[0]);
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					$.hidePreloader();
					var res = JSON.parse(xhr.responseText);
					if (res.code === 1) {
						_upfile.find('img.img').attr('src', res.serverPath);
						_upfile.find('input.input').val(res.serverPath);
					} else {
						$.alert(res.message, '提示');
					}
				}
			};
			xhr.open("POST", '/app/imagesUpload.htm', true);
			xhr.send(oMyForm);
		});
	});
});