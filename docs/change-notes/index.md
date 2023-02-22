# Release Notes

## [v2.1.0 - January 30, 2023](https://github.com/anchovycation/metronom/releases/tag/v2.1.0)
### Added
 + Internal Logger added
 + IRedisAdaptor interface and NodeRedisAdaptor added, basic redis command abstructed

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v2.0.0...v2.1.0](https://github.com/anchovycation/metronom/compare/v2.0.0...v2.1.0)

---

## [v2.0.0 - January 20, 2023](https://github.com/anchovycation/metronom/releases/tag/v2.0.0)
### Added
 + `Metronom` object
 +  Limit parameter added to `Model.getAll` function
 +  Type and default value support added to schema

---

### Changed
 +  `MetronomInstance.save` function will save only the changed fields by tracing the proxy
 +  changedValues added to MetronomInstance

---

### Fixed
 + Unflex model's empty schema error fixed 

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v1.4.0...v2.0.0](https://github.com/anchovycation/metronom/compare/v1.4.0...v2.0.0)


## [v1.4.0 - July 12, 2022](https://github.com/anchovycation/metronom/releases/tag/v1.4.0)
### Added
 + `ModelInstance.destroy()` function

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v1.3.1...v1.4.0](https://github.com/anchovycation/metronom/compare/v1.3.1...v1.4.0)

---

## [v1.3.1 - July 9, 2022](https://github.com/anchovycation/metronom/releases/tag/v1.3.1)
### Fixed
 + `Utilites.safeWrite` function's business logic

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v1.3.0...v1.3.1](https://github.com/anchovycation/metronom/compare/v1.3.0...v1.3.1)

---

## [v1.3.0 - Marh 03, 2022](https://github.com/anchovycation/metronom/releases/tag/v1.3.0)
### Added
 +  `ModelInstance.getPureData` function added
 +  `Model.createInstance` function added
 +  `Model.filter` function added

### Changed
 + `ModelInstance.toJSON` business logic changed

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v1.2.0...v1.3.0](https://github.com/anchovycation/metronom/compare/v1.2.0...v1.3.0)

---

## [v1.2.0 - February 16, 2022](https://github.com/anchovycation/metronom/releases/tag/v1.2.0)
### Added
 + `Model.getAll` function added

### Changed
 + `Model.redisClient` type updated to `RedisClientType`

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v1.1.1...v1.2.0](https://github.com/anchovycation/metronom/compare/v1.1.1...v1.2.0)

---

## [v1.1.1 - February 15, 2022](https://github.com/anchovycation/metronom/releases/tag/v1.1.1)
### Added
 +  `safeRead` and `safeWrite` functions added
 +  Flex schema feature implemented

**Full Changelog**: https://github.com/anchovycation/metronom/compare/v1.0.0...v1.1.1

---
## [v1.0.0 - February 14, 2022](https://github.com/anchovycation/metronom/releases/tag/v1.1.0)
First version of metronom. Basic CRUD functions added

### Added
 + `Model.create()` function added
 + `Model.findById()`
 + `Model.deleteById()`
 + `ModelInstance.save()`

**Full Changelog**: [https://github.com/anchovycation/metronom/compare/v1.3.1...v1.4.0](https://github.com/anchovycation/metronom/compare/v1.3.1...v1.4.0)