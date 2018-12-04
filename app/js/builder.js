import { html as beautify } from 'js-beautify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/builder.css';

var html = '';
var result = document.getElementById('result');

function clearElement(el) {
	el.innerHTML = '';
}

function getMainSlices() {
	return document.querySelectorAll('.main.slice');
}

function getSlices() {
	return document.getElementsByClassName('slice');
}

function download(doc) {
	doc = beautify(doc, { indent_size: 2 });

	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:attachment/text,' + encodeURI(doc);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'index.html';
	hiddenElement.click();
}

function fillSlices() {
	var firstSlice = '';
	var allSlices = getSlices();

	// fill slice numbers
	if (allSlices[0].children[1].value != '') {
		firstSlice = allSlices[0].children[1].value.match(/(.+)(\d{2})(\.\w+)/);

		for (var i = 1; i < allSlices.length; i++) {
			var num = parseInt(firstSlice[2]) + i;
			num = num < 10 ? String('0' + num) : String(num);

			allSlices[i].children[1].value = firstSlice[1] + num + firstSlice[3];
		}
	}
}

function changeSlices(qtd) {
	qtd = qtd > 20 ? 20 : qtd;
	var allSlices = getMainSlices();
	var sliceWrapper = document.getElementById('row-wrapper');
	var fields = '';

	if (qtd > allSlices.length) {
		// add rows to HTML
		for (var i = allSlices.length + 1; i <= qtd; i++) {
			fields = `<h5>Row ${i}</h5><input class="form-control form-control-sm" type="text" name="image" placeholder="Image"><input class="form-control form-control-sm" type="text" name="rilt" placeholder="Rilt"><input class="form-control form-control-sm" type="text" name="href" placeholder="Link" value="https://www.evino.com.br"><button type="button" class="enable-extra btn btn-warning btn-sm btn-build">+</button><div class="extra"><h5>Double slice</h5><input class="form-control form-control-sm" type="text" placeholder="Image"><input class="form-control form-control-sm" type="text" placeholder="Rilt"><input class="form-control form-control-sm" type="text" placeholder="Link" value="https://www.evino.com.br"></div>`;

			var div = document.createElement('div');
			div.className = 'main slice';
			div.innerHTML = fields;

			document.getElementById('row-wrapper').appendChild(div);
		}
	} else if (qtd < allSlices.length) {
		// delete rows from HTML
		for (i = allSlices.length - 1; i >= qtd; i--) {
			sliceWrapper.removeChild(sliceWrapper.children[i]);
		}
	}
}

// parse FTP URL and outputs final images address
function parseLink(link) {
	if (link.indexOf('red.production') > 0) {
		link = link.replace('ftp://red.production@media','http://static');
		link = link.replace(/:\d+\/data/,'');
	}
	return link;
}

function build(template) {
	var allSlices = getSlices();
	var parsedLinks = [];
	var sliceTemplate = '';
	var iframe = '';
	var count = 0;

	while (count < allSlices.length) {
		parsedLinks.push(parseLink(allSlices[count].children[1].value));

		if (allSlices[count].lastElementChild.className === 'extra slice') {
			parsedLinks.push(parseLink(allSlices[count+1].children[1].value));

			sliceTemplate += `<tr>
                <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="650" style="border-collapse:collapse;line-height:100%!important;width:650px">
                        <tr>
                            <td width="325">
                                <a href="${allSlices[count].children[3].value}" target="_blank" rilt="${allSlices[count].children[2].value}">
                                    <img src="${parsedLinks[count]}" alt="" style="display:block">
                                </a>
                            </td>
                            <td width="325">
                                <a href="${allSlices[count+1].children[3].value}" target="_blank" rilt="${allSlices[count+1].children[2].value}">
                                    <img src="${parsedLinks[count+1]}" alt="" style="display:block">
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
			count += 2;
		} else {
			sliceTemplate += `<tr>
                <td>
                    <a href="${allSlices[count].children[3].value}" target="_blank" rilt="${allSlices[count].children[2].value}">
                        <img src="${parsedLinks[count]}" alt="Evino" style="display:block">
                    </a>
                </td>
            </tr>`;
			count++;
		}
	}

	if (template === 'premium') {
		html = `<html><head> <meta charset="utf-8"> <link href="https://fonts.googleapis.com/css?family=Barlow+Semi+Condensed|Montserrat" rel="stylesheet"> <style>body{background-color: #282828; background-attachment: fixed;}</style></head><body style="background-color:#282828;margin:0;padding:0;" bgcolor="#282828"> <div style="display:none; white-space:nowrap; font:15px courier; color:#ffffff; line-height:0; width:650px !important; min-width:650px !important; max-width:650px !important;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; line-height: 100% !important; width: 650px !important" width="650"> <tr> <td width="650"> <table bgcolor="#282828" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; line-height: 100% !important;"> <tr> <td style="display:none;visibility:hidden">Vai de vinho, vai de ( evino ). Os melhores vinhos as melhores ofertas, n&atilde;o deixe para amanh&atilde; o que se pode degustar hoje ;) </td></tr><tr> <td width="325" style="font-size:10px; font-family:Arial, Helvetica, sans-serif; text-align:center;padding-top:2px; padding-bottom:2px;"><a href="\${form(campaign.name,{'usedb', true})}" style="color:#777;" target="_blank">Visualize no seu navegador</a> </td><td width="325" style="font-size:10px; font-family:Arial, Helvetica, sans-serif; text-align:center;padding-top:2px; padding-bottom:2px;"><a href="\${form('Opt_Out',{})}" style="color:#777;" target="_blank">Descadastre-se</a> </td></tr></table> <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; line-height: 100% !important;"><tr> <td class="cell"><a href="https://www.evino.com.br" target="_blank" rilt="Header"><img src="https://static.evino.com.br/BR/upload/news/2018/11_Novembro/PreHeader_Flashblack/Templates_Header_Premium.gif" alt="" style="display:block"></a></td></tr> ${sliceTemplate}<tr> <td class="cell"><a href="${allSlices[0].children[3].value}" target="_blank" rilt="Footer"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/assinatura-premium.gif" alt="Vai de vinho, vai de ( evino )" style="display:block"></a></td></tr></table> <table bgcolor="#0a0c0c" width="650" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td rilt="Fale conosco" width="454" class="cell"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_01.jpg" alt="Fale Conosco" style="display:block"></td><td rilt="Certificado" class="cell"><a href="https://evino.zendesk.com/hc/pt-br" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_02.jpg" alt="Loja Excelente - e-bit" style="display:block"></a></td></tr></table> <table bgcolor="#0a0c0c" width="650" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td class="cell"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_03.jpg" alt="Siga-nos" style="display:block"></td></tr></table> <table bgcolor="#0a0c0c" width="650" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td rilt="SKU-Categoria" class="cell"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_04.jpg" alt="" style="display:block"></td><td rilt="Twitter" class="cell"><a href="https://www.facebook.com/evino/" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_05.jpg" alt="Siga-nos no Facebook" style="display:block"></a></td><td rilt="Youtube" class="cell"><a href="https://instagram.com/evino/" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_06.jpg" alt="Siga-nos no Instagram" style="display:block"></a></td><td rilt="Instagram" class="cell"><a href="https://twitter.com/evino" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_07.jpg" alt="Siga-nos no Twitter" style="display:block"></a></td><td rilt="Linkedin" class="cell"><a href="https://www.youtube.com/evino" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_08.jpg" alt="Siga-nos no Youtube" style="display:block"></a></td><td rilt="Google-Plus" class="cell"><a href="https://www.linkedin.com/company/3514184" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_09.jpg" alt="Siga-nos no LinkedIn" style="display:block"></a></td><td rilt="Facebook" class="cell"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_10.jpg" alt="" style="display:block"></td><td rilt="SKU-Categoria" class="cell"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_11.jpg" alt="" style="display:block"></td><td rilt="APP" class="cell"><a href="https://app.adjust.com/je9ap6?fallback=https%3A%2F%2Fwww.evino.com.br%2F&redirect_android=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dbr.com.evino.android&redirect_ios=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fevino-compre-vinho-online%2Fid1008719792%3Fls%3D1%26mt%3D8" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_12.jpg" alt="" style="display:block"></a></td><td rilt="APP" class="cell"><a href="https://app.adjust.com/je9ap6?fallback=https%3A%2F%2Fwww.evino.com.br%2F&redirect_android=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dbr.com.evino.android&redirect_ios=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fevino-compre-vinho-online%2Fid1008719792%3Fls%3D1%26mt%3D8" target="_blank"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_13.jpg" alt="" style="display:block"></a></td><td rilt="SKU-Categoria" class="cell"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_14.jpg" alt="" style="display:block"></td></tr></table> <table bgcolor="#0a0c0c" width="650" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td class="cell"><a href="https://www.evino.com.br/" target="_blank" rilt="SKU-Categoria"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_15.jpg" alt="Formas de Pagamento" style="display:block"></a></td></tr><tr> <td class="cell"><a href="https://www.evino.com.br/" target="_blank" rilt="SKU-Categoria"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_16.jpg" alt="Formas de Pagamento" style="display:block"></a></td></tr></table> <table bgcolor="#0a0c0c" width="650" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td height="0"><p style="color:#656565; text-align:justify; font-size:9px;font-family: 'Montserrat', sans-serif; margin-top:0;margin-bottom:10px;padding-top:10;padding-bottom:10; line-height:14px; margin-top:10px; margin-bottom:10px; margin-left:50px; margin-right:50px;" class="reminder"><b>PROIBIDA A VENDA PARA MENORES DE 18 ANOS | SE BEBER, N&Atilde;O DIRIJA | BEBA COM MODERA&Ccedil;&Atilde;O</b><br/><br/>Adicione os emails <b>atendimento@news.evino.com.br</b> e <b>atendimento@mail.e-vino.com.br</b> ao seu cat&aacute;logo de endere&ccedil;os. N&oacute;s respeitamos a sua privacidade e somos contra o spam na rede. Os pre&ccedil;os s&atilde;o v&aacute;lidos enquanto durarem os nossos estoques e est&atilde;o sujeitos a altera&ccedil;&otilde;es sem aviso pr&eacute;vio. O uso de cupons promocionais &eacute; limitado pelo CPF de cada usu&aacute;rio e os vouchers n&atilde;o s&atilde;o cumulativos. As imagens s&atilde;o meramente ilustrativas. A Evino usa tecnologia segura para garantir que suas informa&ccedil;&otilde;es de cart&atilde;o de cr&eacute;dito n&atilde;o sejam comprometidas. As informa&ccedil;&otilde;es s&atilde;o criptografadas e nunca armazenadas.<br/> <br>O pagamento parcelado em nossa loja est&aacute; sujeito a uma parcela m&iacute;nima de R$60,00.<br/> <br>*Frete gr&aacute;tis para compras acima de R$250,00 para os estados de S&atilde;o Paulo, Rio de Janeiro, Minas Gerais, Paran&aacute;, Santa Catarina e Rio Grande do Sul,para o Distrito Federal, Vila Velha (ES), e para as capitais Vit&oacute;ria (ES), Salvador (BA), Recife (PE), Fortaleza (CE), Goi&acirc;nia (GO), Jo&atilde;o Pessoa (PB), Aracaju (SE), Cuiab&aacute; (MT), Campo Grande (MS), Macei&oacute; (AL), Teresina (PI) e Natal (RN). Frete gr&aacute;tis para compras acima de R$299,00 para as capitais Porto Velho (RO), Boa Vista (RR), Rio Branco (AC), Macap&aacute; (AP) e S&atilde;o Luis (MA).<br><b style="font-size:11px; text-align:justify;"><br>E-vino Com&eacute;rcio de Vinhos Ltda &middot; Rua Holdercim, 840 &middot; Civit II &middot; Serra &middot; ES &middot; CEP: 29168-066</b><br><br></p></td></tr></table> <table bgcolor="#0a0c0c" width="650" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td class="cell"><a href="https://www.evino.com.br/" target="_blank" rilt="SKU-Categoria"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_18.jpg" alt="Formas de Pagamento" style="display:block"></a></td></tr><tr> <td class="cell"><a href="https://www.evino.com.br/" target="_blank" rilt="SKU-Categoria"><img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images_premium/footer_premium_19.jpg" alt="Formas de Pagamento" style="display:block"></a></td></tr></table> </body> </html>`;
	} else {
		html = `<html> <head> <meta charset="utf-8"> <link href="https://fonts.googleapis.com/css?family=Barlow+Semi+Condensed|Montserrat" rel="stylesheet"> </head> <body style="background-color:#282828;margin:0;padding:0;" bgcolor="#282828"> <div style="display:none; white-space:nowrap; font:15px courier; color:#ffffff; line-height:0; width:650px !important; min-width:650px !important; max-width:650px !important;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; line-height: 100% !important; width: 650px !important" width="650"> <tr> <td width="650"> <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; line-height: 100% !important;"> <tr> <td style="display:none;visibility:hidden">Vai de vinho, vai de ( evino ). Os melhores vinhos as melhores ofertas, n&atilde;o deixe para amanh&atilde; o que se pode degustar hoje ;) </td></tr><tr> <td width="325" style="font-size:10px; font-family:Arial, Helvetica, sans-serif; text-align:center;padding-top:2px; padding-bottom:2px;"><a href="\${form(campaign.name,{'usedb', true})}" style="color:#777;" target="_blank">Visualize no seu navegador</a> </td><td width="325" style="font-size:10px; font-family:Arial, Helvetica, sans-serif; text-align:center;padding-top:2px; padding-bottom:2px;"><a href="\${form('Opt_Out',{})}" style="color:#777;" target="_blank">Descadastre-se</a> </td></tr></table> <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; line-height: 100% !important;"> <tr> <td class="cell"><a href="https://www.evino.com.br" target="_blank" rilt="Header"><img src="https://static.evino.com.br/BR/upload/news/2018/11_Novembro/PreHeader_Flashblack/Templates_Header.gif" alt="" style="display:block"></a></td></tr>${sliceTemplate}<tr> <td> <a href="${allSlices[0].children[3].value}" target="_blank" rilt="Footer"> <img src="http://static.evino.com.br/BR/upload/news/2018/05_Maio/2018_05_08_redday_12h/images/assinatura.gif" alt="Assinatura" style="display:block"> </a> </td></tr></table> <table bgcolor="#f5f3f3" cellpadding="0" cellspacing="0" border="0" align="center" style="width:650px"> <tr> <td rilt="Fale conosco" width="324"> <img align="left" src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_01.jpg" alt="Fale Conosco" style="display:block;float:left;border:none;margin:0"> </td><td rilt="Certificado" width="326"> <a href="https://evino.zendesk.com/hc/pt-br" target="_blank" style="display:block;float:left;border:none;margin:0;text-decoration:none"> <img align="left" src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_02.jpg" alt="Loja Excelente - e-bit" style="display:block;float:left;border:none;margin:0"> </a> </td></tr></table> <table bgcolor="#f5f3f3" cellpadding="0" cellspacing="0" border="0" align="center"> <tr> <td> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_03.jpg" alt="Siga-nos" style="display:block"> </td></tr></table> <table bgcolor="#f5f3f3" cellpadding="0" cellspacing="0" border="0" align="center"> <tr> <td rilt="SKU-Categoria" width="40"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_04.jpg" alt="" width="40" style="display:block"> </td><td rilt="Facebook" width="35"> <a href="https://www.facebook.com/evino/" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_05.jpg" alt="Siga-nos no Facebook" width="35" style="display:block"> </a> </td><td rilt="Instagram" width="42"> <a href="https://instagram.com/evino/" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_06.jpg" alt="Siga-nos no Instagram" width="42" style="display:block"> </a> </td><td rilt="Twitter" width="38"> <a href="https://twitter.com/evino" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_07.jpg" alt="Siga-nos no Twitter" width="38" style="display:block"> </a> </td><td rilt="Youtube" width="41"> <a href="https://www.youtube.com/evino" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_08.jpg" alt="Siga-nos no Youtube" width="41" style="display:block"> </a> </td><td rilt="Linkedin" width="41"> <a href="https://www.linkedin.com/company/3514184" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_09.jpg" alt="Siga-nos no LinkedIn" width="41" style="display:block"> </a> </td><td rilt="SKU-Categoria" width="87">&nbsp;</td><td rilt="APP" width="143"> <a href="https://app.adjust.com/je9ap6?fallback=https%3A%2F%2Fwww.evino.com.br%2F&redirect_android=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dbr.com.evino.android&redirect_ios=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fevino-compre-vinho-online%2Fid1008719792%3Fls%3D1%26mt%3D8" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_12.jpg" alt="" width="143" style="display:block"> </a> </td><td rilt="APP" width="140"> <a href="https://app.adjust.com/je9ap6?fallback=https%3A%2F%2Fwww.evino.com.br%2F&redirect_android=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dbr.com.evino.android&redirect_ios=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fevino-compre-vinho-online%2Fid1008719792%3Fls%3D1%26mt%3D8" target="_blank"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_13.jpg" alt="" width="140" style="display:block"> </a> </td><td rilt="SKU-Categoria" width="43"> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_14.jpg" alt="" width="43" style="display:block"> </td></tr></table> <table bgcolor="#f5f3f3" cellpadding="0" cellspacing="0" border="0" align="center"> <tr> <td> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_c_15.jpg" alt="Formas de Pagamento" style="display:block"> </td></tr><tr> <td> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_16.jpg" alt="" style="display:block"> </td></tr><tr> <td height="0"> <p style="color:#656565; text-align:justify; font-size:9px;font-family: 'Montserrat', sans-serif; margin-top:0;margin-bottom:10px;padding-top:10;padding-bottom:10; line-height:1.6!important; margin-top:10px; margin-bottom:10px; margin-left:50px; margin-right:50px;" class="reminder"> <b>PROIBIDA A VENDA PARA MENORES DE 18 ANOS | SE BEBER, N&Atilde;O DIRIJA | BEBA COM MODERA&Ccedil;&Atilde;O</b><br/><br/>Adicione os emails <b><a href="mailto:atendimento@news.evino.com.br" style="color:#656565!important;text-decoration:none!important">atendimento@news.evino.com.br</a></b> e <b><a href="mailto:atendimento@mail.e-vino.com.br" style="color:#656565!important;text-decoration:none!important">atendimento@mail.e-vino.com.br</a></b> ao seu cat&aacute;logo de endere&ccedil;os. N&oacute;s respeitamos a sua privacidade e somos contra o spam na rede. Os pre&ccedil;os s&atilde;o v&aacute;lidos enquanto durarem os nossos estoques e est&atilde;o sujeitos a altera&ccedil;&otilde;es sem aviso pr&eacute;vio. O uso de cupons promocionais &eacute; limitado pelo CPF de cada usu&aacute;rio e os vouchers n&atilde;o s&atilde;o cumulativos. As imagens s&atilde;o meramente ilustrativas. A Evino usa tecnologia segura para garantir que suas informa&ccedil;&otilde;es de cart&atilde;o de cr&eacute;dito n&atilde;o sejam comprometidas. As informa&ccedil;&otilde;es s&atilde;o criptografadas e nunca armazenadas.<br/> <br>O pagamento parcelado em nossa loja est&aacute; sujeito a uma parcela m&iacute;nima de R$60,00.<br/> <br>*Frete gr&aacute;tis para compras acima de R$250,00 para os estados de S&atilde;o Paulo, Rio de Janeiro, Minas Gerais, Paran&aacute;, Santa Catarina e Rio Grande do Sul, para o Distrito Federal, Vila Velha (ES), e para as capitais Vit&oacute;ria (ES), Salvador (BA), Recife (PE), Fortaleza (CE), Goi&acirc;nia (GO), Jo&atilde;o Pessoa (PB), Aracaju (SE), Cuiab&aacute; (MT), Campo Grande (MS), Macei&oacute; (AL), Teresina (PI) e Natal (RN). Frete gr&aacute;tis para compras acima de R$299,00 para as capitais Porto Velho (RO), Boa Vista (RR), Rio Branco (AC), Macap&aacute; (AP) e S&atilde;o Luis (MA).<br><br><b>E-vino Com&eacute;rcio de Vinhos Ltda &middot; Rua Holdercim, 840 &middot; Civit II &middot; Serra &middot; ES &middot; CEP: 29168-066</b> </p></td></tr><tr> <td> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_18.jpg" alt="" style="display:block"> </td></tr><tr> <td> <img src="http://static.evino.com.br/BR/upload/news/content/footer2018/images/footer_b_19.jpg" alt="" style="display:block"> </td></tr></table> </td></tr></table> </body> </html>`;
	}

	clearElement(result);

	iframe = document.createElement('iframe');
	iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

	document.getElementById('result').appendChild(iframe);
}

document.getElementById('total-rows').addEventListener('change', function() {
	changeSlices(this.value);
});

document.getElementById('fill').addEventListener('click', function() {
	fillSlices();
});

document.getElementById('download').addEventListener('click', function() {
	download(html);
});

document.getElementById('premium').addEventListener('click', function() {
	build('premium');
});

document.getElementById('pop').addEventListener('click', function() {
	build();
});

document.addEventListener('click', function(e) {
	if (e.target && e.target.className.indexOf('enable-extra') >= 0) {
		var extra = e.target.parentElement.lastElementChild.classList;
		extra.toggle('slice');
	}
});
