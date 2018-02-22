<?php

/**
* Update class
*/
class PolyimagesUpdater
{
	/**
	 * check version and update db data
	 */
	function __construct($modx) {
		$this->modx = $modx;
		$this->table = $this->modx->db->config['table_prefix'].'polyimages';
		$is_init = $this->initialized();
		if($is_init === false) $this->init();
	}

	/**
	 * detect initialized module status
	 * @return boolean
	 */
	public function initialized()
	{
		$sql = "SHOW TABLES LIKE '".$this->modx->db->config['table_prefix']."polyimages'";
		$query = $this->modx->db->query( $sql );
		$hasTable = $this->modx->db->getRecordCount( $query );

		if($hasTable>0) return true; return false;
	}

	/**
	 * create db module table
	 * @return void
	 */
	public function init($drop = false) {

		$sql = array();

		if($drop) {
			$sql[] = "DROP TABLE IF EXISTS `{PREFIX}polyimages`;";
			$sql[] = "DROP TABLE IF EXISTS `{PREFIX}polyimages_elements`;";
		}

		$sql[] ="
		CREATE TABLE IF NOT EXISTS `{PREFIX}polyimages` (
			`id` int(10) unsigned NOT NULL,
			`name` varchar(100) NOT NULL,
			`image` mediumtext NOT NULL,
			`active` int(10) DEFAULT '0')
		ENGINE=MyISAM DEFAULT CHARSET=utf8 ;
		";

		$sql[] ="
		CREATE TABLE IF NOT EXISTS `{PREFIX}polyimages_elements` (
			`id` int(10) unsigned NOT NULL,
			`image_id` int(10) NOT NULL,
			`type` varchar(100) NOT NULL,
			`position` mediumtext NOT NULL,
			`config` mediumtext NOT NULL)
		ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";

		$sql[] ="
			ALTER TABLE `{PREFIX}polyimages` 
			ADD PRIMARY KEY (`id`), MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
		";

		$sql[] ="
			ALTER TABLE `{PREFIX}polyimages_elements` 
			ADD PRIMARY KEY (`id`), MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
		";

		foreach ($sql as &$s) {

			$s = str_replace('{PREFIX}', $this->modx->db->config['table_prefix'], $s);

			$this->modx->db->query($s);
		}
	}

}