<?php

/**
* 
*/
class Polyimages
{

	public static $modx = [];
	public static $tablename = 'polyimages';
	public static $fields = ['name', 'objects', 'image', 'active'];
	public static $elements = [];

	/**
	 * Получить все записи полигонов
	 * @return array
	 */
	public static function getAll()
	{
		$result = self::$modx->db->select("*", self::$modx->getFullTableName(static::$tablename));
		$out = array();
		while( $row = self::$modx->db->getRow( $result ) ){
			$row['objects'] = self::$elements::where(['image_id'=>$row['id']]);
		 	$out[] = $row;
		}
        return $out;
	}

	/**
	 * Получить запись полигона по id
	 * @param  integer $id
	 * @return mixed
	 */
	public static function get($id = 0)
	{
		if(empty($id)) return false;
		$id = intval($id);
		$result = self::$modx->db->select("*", self::$modx->getFullTableName(static::$tablename), "id = $id");
		if( self::$modx->db->getRecordCount( $result ) >= 1 ){
			$row = self::$modx->db->getRow( $result );
			$row['objects'] = self::$elements::where(['image_id'=>$row['id']]);
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
		$objects = $fields['objects'];
		unset($fields['objects']);
		
		if(!empty($fields)) self::$modx->db->update( $fields, self::$modx->getFullTableName(static::$tablename), "id = $id" );

		if(!empty($objects)){
			$objectsArray = json_decode($objects, true);
			foreach ($objectsArray as $object) {
				
				if(!empty($object['removed'])){
					if(!empty($object['id'])) self::$elements::delete($object['id']);
					continue;
				}

				$fields = self::$elements::filterFields($object);
				$fields['position'] = (!empty($fields['position'])) ? $fields['position'] : [];
				$fields['position'] = json_encode($fields['position']);

				$fields['config'] = (!empty($fields['config'])) ? $fields['config'] : [];
				$fields['config'] = json_encode($fields['config']);

				$fields['image_id'] = $id;

				if(!empty($object['id'])){

					self::$elements::update($object['id'], $fields);

				}else{

					self::$elements::create($fields);

				}

			}
		}

		return self::get($id);
	}

	/**
	 * Удалить запись по id
	 * @param  integer $id 
	 * @return boolean
	 */
	public static function delete($id = 0)
	{
		if(empty($id)) return false;
		$id = intval($id);
		$delete = self::$modx->db->delete(self::$modx->getFullTableName(static::$tablename), "id = $id");
		return $delete;
	}

	/**
	 * Добавить запись
	 * @param  array  $fields 
	 * @return mixed
	 */
	public static function create($fields = array())
	{
		$insert = self::$modx->db->insert( $fields, self::$modx->getFullTableName(static::$tablename)); 

		if($insert){
			$id = self::$modx->db->getInsertId();
			return self::get($id);
		}else{
			return false;
		}
	}

	public static function filterFields($fields = array())
	{
		$out = array();
		
		foreach ($fields as $key => $field)
			if(in_array($key, static::$fields)){
				$out[$key] = $field;
			}

		return $out;
	}


	public static function where($where=[])
	{
		if(empty($where)) return false;
		$whereString = [];
		$operators = ["LIKE",">","<","=",">=","<=","NOT LIKE"];
		foreach ($where as $name => $value) {
			if (in_array($name, static::$fields)){

				$operator = "=";
				$valueArray = explode("|", $value);
				if (count($valueArray) == 2 && in_array($valueArray[0], $operator)) {
					$operator = $valueArray[0];
					$value = $valueArray[1];
				}
				$value = self::$modx->db->escape($value);
				$name = self::$modx->db->escape($name);

				$whereString[] = $name.$operator.$value;
			}
		}
		
		if (empty($whereString)) return false;

		$result = self::$modx->db->select("*", self::$modx->getFullTableName(static::$tablename), implode(",", $whereString));

		if( self::$modx->db->getRecordCount( $result ) >= 1 ){
			$out = [];
			while($row = self::$modx->db->getRow( $result )){
				$row = static::postSelect($row);
				$out[] = $row;
			}

			return $out;
		}

		return false; 

	}

	public static function postSelect($row=array())
	{
		return $row;
	}

}