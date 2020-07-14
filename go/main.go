package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "smallfish"
	password = "smallfish"
	dbname   = "smallfish"
)

const SqlStr string = `create table test( ID SERIAL PRIMARY KEY , name TEXT not null);`

func main() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	fmt.Println(psqlInfo)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}


	err = db.Ping()
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(SqlStr)
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully!")


	defer db.Close()
}
