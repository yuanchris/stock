/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback */
const express = require('express');
require('dotenv').config('../');
const request = require('request');
const rp = require('request-promise');

const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { promisify } = require('util');

const mysql = require('./util/mysql_con.js');
const utility = require('./util/util.js');

const { db } = mysql;
const dbquery = promisify(db.query).bind(db);

async function main() {
  // linked list
  class Node {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
  }
  class LinkedList {
    constructor() {
      this.length = 0;
      this.head = null;
    }

    append(item) {
      const node = new Node(item);
      if (!this.head) {
        this.head = node;
      } else {
        let tail = this.head;
        while (tail.next !== null) {
          tail = tail.next;
        }
        tail.next = node;
      }
      this.length += 1;
    }

    insert(index, value) {
      if (index < 0 || index > this.length) { return false; }
      const node = new Node(value);
      let pointer = this.head;
      for (let i = 1; i < index; i++) {
        pointer = pointer.next;
        
      }
      node.next = pointer.next;
      pointer.next = node;
      this.length += 1;
    }
  }


  const list = new LinkedList();
  list.append('c');
  list.append('h');
  list.append('r');
  list.append('s');
  list.insert(3, 'i');
  console.log(list);
  let now_point = list.head;
  console.log(list.head);
  for (let i = 1; i < list.length; i++) {
    now_point = now_point.next;
    console.log(now_point);
    
  }
  
}
main();
