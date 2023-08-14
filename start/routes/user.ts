/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/user', 'UsersController').apiOnly()
  }).middleware('auth').middleware('adminRoutes')
}
