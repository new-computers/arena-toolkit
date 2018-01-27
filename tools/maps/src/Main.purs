module Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)

import Bridge.MaybeNullable (provide)

main :: forall e. Eff (console :: CONSOLE | e) Unit
main = do
  log "PS.Main.main"
