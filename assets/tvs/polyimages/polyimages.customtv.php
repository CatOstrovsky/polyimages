<?php

if (!IN_MANAGER_MODE) {
    die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');
}
$id = 0;
if (isset($_GET['id']) && (int)$_GET['id'] > 0) $id = $_GET['id'];

require_once(MODX_BASE_PATH."assets/modules/polyimages/classes/polyimages.class.php");
require_once(MODX_BASE_PATH."assets/modules/polyimages/classes/polyimages.elements.class.php");
Polyimages::$modx = $modx;
PolyimagesElements::$modx = $modx;
Polyimages::$elements = PolyimagesElements::class;

$images = Polyimages::getAll();
$out = "";

if(!function_exists("maskTags")){
	function maskTags($value)
    {
        $unmasked = array('[', ']', '{', '}');
        $masked = array('&#x005B;', '&#x005D;', '&#x007B;', '&#x007D;');
        return str_replace($unmasked, $masked, $value);
    }
}

if ($id) {
	$tv = $modx->getTemplateVarOutput('image', $pid);
	if(!empty($images)) {

		$value = $row['value'];

		if(!empty($value)){
			$value = json_decode($value, true);
			if(!empty($value['selected']) && is_array($value)) 
				$value['selected'] = maskTags($value['selected']);
			$value = json_encode($value);
		}?>

		<textarea id='tv<?=$row["id"]?>' name='tv<?=$row["id"]?>' style="display:none"><?echo $value;?></textarea>

		<select class="polyimages" id="poly_select_<?=$row['id']?>" data-for="tv_<?=$row['id']?>">
		<?
		foreach ($images as $polyimage) {
			$objects = [];
			if(!empty($polyimage['objects']) && is_array($polyimage['objects']))
				foreach ($polyimage['objects'] as $object) $objects[] = ['id'=>$object['id'], 'type'=>$object['type']];
			$objects = json_encode($objects);?>

			<option data-image='<?=$polyimage["image"]?>' data-objects='<?=$objects?>' value='<?=$polyimage["id"]?>' data-id='<?=$polyimage["id"]?>'><?=$polyimage["name"]?></p>
		<?}?>
		
		</select>
		<script src='/assets/tvs/polyimages/polyimages.js?<?=rand()?>'></script>
		<script>makePoly(<?=$row['id']?>,jQuery("#tv<?=$row["id"]?>").text())</script>
		<link rel='stylesheet' type='text/css' href='/assets/tvs/polyimages/polyimages.css'/>

		
	<?}

}?>