<?php
if(!defined('MODX_BASE_PATH')){die('What are you doing? Get out of here!');}

include_once("assets/modules/polyimages/classes/polyimages.class.php");
include_once('assets/modules/polyimages/classes/polyimages.elements.class.php');

//Подключаем обработку шаблонов через DocLister
include_once(MODX_BASE_PATH.'assets/snippets/DocLister/lib/DLTemplate.class.php');
$parser = DLTemplate::getInstance($modx);

Polyimages::$modx = $modx;
PolyimagesElements::$modx = $modx;
Polyimages::$elements = PolyimagesElements::class;

if (empty($tvName)) return;
$docId = (!empty($docId)) ? intval($docId) : $modx->documentIdentifier;
$css = (!empty($css) && $css == 0) ? false : true;
$js = (!empty($js) && $js == 0) ? false : true;
$tpl = (!empty($tpl)) ? $tpl : '@CODE:'.file_get_contents(dirname(__FILE__).'/tpl/row.tpl');


$tvValue = $modx->getTemplateVarOutput($tvName, $docId);
if(empty($tvValue[$tvName])) return;
$tvValue = json_decode($tvValue[$tvName], true);
if(empty($tvValue['value'])) return;
$id = intval($tvValue['value']);

$image = Polyimages::get($id);

if($css) $modx->regClientCSS( "/assets/snippets/polyimages/src/css/style.css" );
if($js) $modx->regClientScript( "/assets/modules/polyimages/src/libs/svg.cordinator/svg.min.js" );
if($js) $modx->regClientScript( "/assets/snippets/polyimages/src/js/init.js" );

if(!empty($image)) {
	$data = $image;
	$data['objects'] = json_encode($data['objects'], false);	
	$data['objects'] = str_replace(["[[", "]]"], ["[ [", "] ]"], $data['objects']);

	return $parser->parseChunk($tpl,$data);
}

return "";
?>