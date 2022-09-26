import React from "react"
import {AsyncStorage} from "react-native"
import {ErrorMessage} from "./HandleMessages";

async function setItem(idx, val){
	try {
		return await AsyncStorage.setItem(idx, val)
	}catch (e) {
		ErrorMessage(e.toString())
	}
}

async function getItem(idx){
	try {
		return await AsyncStorage.getItem(idx)
	}catch (e) {
		ErrorMessage(e.toString())
	}
}

export {
	getItem,
	setItem
}
