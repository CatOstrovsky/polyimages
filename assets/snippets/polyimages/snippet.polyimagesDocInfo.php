<?php
	if(!defined('MODX_BASE_PATH')){die('What are you doing? Get out of here!');}

	//Подключаем обработку шаблонов через DocLister
	include_once(MODX_BASE_PATH.'assets/snippets/DocLister/lib/DLTemplate.class.php');
	$parser = DLTemplate::getInstance($modx);

	$tpl = (!empty($tpl)) ? $tpl : '';
	$api = (!empty($api)) ? $api : '';
	$docId = (!empty($docId)) ? intval($docId) : $modx->documentIdentifier;

	if (empty($tvName)) return;

	$tvValue = $modx->getTemplateVarOutput($tvName, $docId);
	if(empty($tvValue[$tvName])) return;
	$tvValue = json_decode($tvValue[$tvName], true);
	if(empty($tvValue['value'])) return;
	$id = intval($tvValue['value']);

	if(!empty($tvValue['selected']) && is_array($tvValue['selected'])){
		foreach ($tvValue['selected'] as $k => $template){
			$object = Polyimages::$elements::get($k);
			if(!empty($tpl)){
				$template = $parser->parseChunk("@CODE: ".$template, ['id'=>$k]);
				$tvValue['selected'][$k] = $parser->parseChunk($tpl, ['id'=>$k, 'value'=>$template]);
			}else{
				$tvValue['selected'][$k] = $parser->parseChunk("@CODE: ".$template, ['id'=>$k]);
			}
		}
	}else{
		$tvValue['selected'] = [];
	}

	if(!empty($tpl) && empty($api)){
		$out = "";
		if(!empty($tvValue['selected']) && is_array($tvValue['selected'])) $out = implode("", $tvValue['selected']);
		return $out;
	}

	return  json_encode($tvValue['selected'], false);
?>