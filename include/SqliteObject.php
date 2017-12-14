<?php
/*
	Copyright (c) 2015-2017, Jacob Psimos
	All rights reserved. SqliteObject.php - A SQLite3 php helper module.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are
	met:

	* Redistributions of source code must retain the above copyright
	  notice, this list of conditions and the following disclaimer.
	* Redistributions in source or binary form must reproduce the above
	  copyright notice, this list of conditions and the following disclaimer
	  in the documentation and/or other materials provided with the
	  distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

	require_once('Strings.php');

	class SqliteObject{

		private $connection = NULL;
		private $databaseFile = '';

		public function __construct(){
			$this->databaseFile = dirname(__FILE__) . '/database.sqlite3';
			$this->connection = new SQLite3($this->databaseFile);
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}
		}

		public function setData($query){
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}

			//echo "$query\n";
			$wasSuccess = $this->connection->exec($query);

			if(!$wasSuccess){
				//https://sqlite.org/c3ref/c_abort.html
				if($this->connection->lastErrorCode() == 6){
					/* Table is locked, retry a few times */
					for($retryNum = 0; $retryNum < 3; $retryNum++){
						sleep(5);
						if($this->connection->exec($query)){
							return TRUE;
						}
					}
					return FALSE;
				}
			}

			return $wasSuccess;
		}

		public function getData($query, $multi = FALSE){
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}

			$results = $this->connection->query($query);
			if(!$results){
				//https://sqlite.org/c3ref/c_abort.html
				if($this->connection->lastErrorCode() == 6){
					/* Table is locked, retry a few times */
					for($retryNum = 0; $retryNum < 3; $retryNum++){
						sleep(5);
						if(($results = $this->connection->exec($query))){
							break;
						}
					}
				}
			}

			if(!$results){
				throw new Exception($this->connection->lastErrorMsg());
				return NULL;
			}

			if($multi){
				$return = array();
				while($row = $results->fetchArray(SQLITE3_ASSOC)){
					array_push($return, $row);
				}
				return $return;
			}

			$row = $results->fetchArray(SQLITE3_ASSOC);
			return $row;
		}

		public function rowExists($tableName, $whereClause){
			$tableName = $this->escapeString($tableName);

			$query = sprintf("SELECT EXISTS(SELECT * FROM `%s` WHERE %s) as `e`",
				$tableName, $whereClause);

			if($row = $this->getData($query)){
				if(isset($row['e'])){
					return $row['e'] ? TRUE : FALSE;
				}
			}
			return FALSE;
		}

		public function escapeString($str){
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}
			return $this->connection->escapeString(stripslashes($str));
		}

		public function getLastError(){
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}
			return $this->connection->lastErrorMsg();
		}

		public function insertQuery($tableName, $keyValuePairs){
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}

			$columns = '';
			$values = '';
			$numValuePairs = count($keyValuePairs);
			$index = 0;

			if($numValuePairs < 1){
				throw new Exception("Must have at least one name/value pair.");
				return NULL;
			}

			foreach($keyValuePairs as $col => $value){
				$col = $this->escapeString($col);
				$value = $this->escapeString($value);

				$colFormatStr = $index < $numValuePairs - 1 ? '`%s`,' : '`%s`';
				$valueFormatStr = $index < $numValuePairs - 1 ? "'%s'," : "'%s'";

				$columns .= sprintf($colFormatStr, $col);
				$values .= sprintf($valueFormatStr, $value);

				$index = $index + 1;
			}

			$query = sprintf("INSERT INTO `%s`(%s) VALUES(%s);", $tableName, $columns, $values);
			return $query;
		}

		public function updateQuery($tableName, $whereClause, $keyValuePairs){
			if(!$this->connection){
				throw new Exception("Failed to open database.");
			}

			$valuePairs = '';
			$len = count($keyValuePairs);
			$i = 0;

			foreach($keyValuePairs as $key => $value){
				$key = $this->escapeString($key);
				$value = $this->escapeString($value);

				$valueFormatStr = $i < $len - 1 ? "`%s`='%s'," : "`%s`='%s'";
				$valuePairs .= sprintf($valueFormatStr, $key, $value);

				$i = $i + 1;
			}

			return sprintf("UPDATE `%s` SET %s WHERE %s", $tableName, $valuePairs, $whereClause);
		}

		public function __destruct(){
			if($this->connection){
				$this->connection->close();
			}
		}
	}
?>
