module Bridge.MaybeNullable where

import Prelude

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, logShow)
import Control.Monad.Except (runExcept)

import Data.Foreign (readString, readNull)
import Data.Traversable (traverse)

import Bridge.Util.Value (foreignValue)

-- handle null with Maybe type
provide :: Eff (console :: CONSOLE) Unit
provide = do
  logShow $ runExcept $
    traverse readString =<< readNull =<< foreignValue "null"
  logShow $ runExcept $
    traverse readString =<< readNull =<< foreignValue "true"

-------------------------

-- bridge :: forall e. Eff (console :: CONSOLE | e) Unit
-- bridge = do
--   log "PS.Main.bridge"
