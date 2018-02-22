<?php 
/**
* 
*/
class PolyimagesElements extends Polyimages
{
	public static $tablename = 'polyimages_elements';
	public static $fields = ['id', 'type', 'position', 'config', 'image_id'];


	/**
	 * Получить все записи полигонов
	 * @return array
	 */
	public static function getAll()
	{
		$result = self::$modx->db->select("*", self::$modx->getFullTableName(static::$tablename));
		$out = array();
		while( $row = self::$modx->db->getRow( $result ) ){
			$row = static::postSelect($row);
		 	$out[] = $row;
		}
        return $out;
	}

	/**
	 * Получить запись по id
	 * @param  integer $id
	 * @return mixed
	 */
	public static function get($id = 0)
	{
		if(empty($id)) return false;
		$id = intval($id);
		$result = self::$modx->db->select("*", self::$modx->getFullTableName(self::$tablename), "id = $id");
		if( self::$modx->db->getRecordCount( $result ) >= 1 ) {
			$row = self::$modx->db->getRow( $result );
			$row = static::postSelect($row);
			return $row;
		}
		
		return false;
	}

	/**
	 * Обновить запись по id
	 * @param  integer $id     
	 * @param  array   $fields 
	 * @return mixed
	 */
	public static function update($id = 0, $fields = array())
	{
		if(empty($id) || empty($fields)) return false;
		$id = intval($id);
		self::$modx->db->update( $fields, self::$modx->getFullTableName(static::$tablename), "id = $id" );

		return self::get($id);
	}

	public static function postSelect($row=[])
	{
		if(!empty($row['position'])) $row['position'] = json_decode($row['position']);
		if(!empty($row['config'])) $row['config'] = json_decode($row['config']);
		return $row;
	}

}
?>