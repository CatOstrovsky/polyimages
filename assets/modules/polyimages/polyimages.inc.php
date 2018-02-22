<?php

/**
 *
 * @name polyimages module for EVO CMS
 * @version 0.0.1
 * @author Rubium_Team <ska@dm100.ru>
 *
 */



ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (IN_MANAGER_MODE != "true" || empty($modx) || !($modx instanceof DocumentParser)) {
	die("<b>INCLUDE_ORDERING_ERROR</b><br /><br />Please use the MODX Content Manager instead of accessing this file directly.");
}

if (!$modx->hasPermission('exec_module')) {
	header("location: " . $modx->getManagerPath() . "?a=106");
}
if(!is_array($modx->event->params)){
    $modx->event->params = array();
}

//Подключаем обработку шаблонов через DocLister
include_once(MODX_BASE_PATH.'assets/snippets/DocLister/lib/DLTemplate.class.php');
$tpl = DLTemplate::getInstance($modx);

include_once('classes/polyimages.class.php');
include_once('classes/polyimages.elements.class.php');
include_once('classes/polyimages.updater.class.php');

$updater = new PolyimagesUpdater($modx);


Polyimages::$modx = $modx;
PolyimagesElements::$modx = $modx;
Polyimages::$elements = PolyimagesElements::class;

$lang = array();
$confgiLang = "en";
if(stripos($modx->config['manager_language'], "russian") !== false) $confgiLang = "ru";
include_once('lang/'.$confgiLang.'.php');

$moduleurl = 'index.php?a=112&id='.$_GET['id'].'&';

$action = isset($_GET['action']) ? $_GET['action'] : 'home';
$action = isset($_POST['action']) ? $_POST['action'] : $action;

$data = array (
	'moduleurl'=> $moduleurl,
	'get' =>$_GET, 
	'action' => $action , 
	'lang' => json_encode($lang[$confgiLang], true),
    'session'=>$_SESSION,
    'site_url'=> $modx->config['site_url']);


switch ($action) {

    case 'home':
	    $template = '@CODE:'.file_get_contents(dirname(__FILE__).'/tpl/home.tpl');
	    $outTpl = $tpl->parseChunk($template,$data);
    break;

    case 'getAll':
	    $outData = Polyimages::getAll();
    break;

    case 'create':
    	$fields = Polyimages::filterFields($_POST);
	    $outData = Polyimages::create($fields);
    break;

    case 'get':
    	$id = $_POST['id'];
	    $outData = Polyimages::get($id);
    break;

    case 'update':
    	$id = $_POST['id'];
    	$fields = Polyimages::filterFields($_POST);
	    $outData = Polyimages::update($id, $fields);
    break;

    case 'delete':
    	$id = $_POST['id'];
	    $outData = Polyimages::delete($id);
    break;

}

// Вывод результата или шаблон или Ajax 
if(!empty($outTpl)){
    $headerTpl = '@CODE:'.file_get_contents(dirname(__FILE__).'/tpl/header.tpl');
    $footerTpl = '@CODE:'.file_get_contents(dirname(__FILE__).'/tpl/footer.tpl');
    $output = $tpl->parseChunk($headerTpl,$data) . $outTpl . $tpl->parseChunk($footerTpl,$data);
}else{ 
    header('Content-type: application/json');
    $output = json_encode($outData, true);
}

echo $output;