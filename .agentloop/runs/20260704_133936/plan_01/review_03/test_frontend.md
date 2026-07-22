# test-frontend

returncode: 0
seconds: 4.03
timed_out: False

## Command
```text
bash -lc npm run test -- --run
```

## STDOUT
```text

> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/store/stores.test.ts  (8 tests) 20ms
 ✓ src/api/client.test.ts  (5 tests) 12ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 69ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 134ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 188ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (3 tests) 341ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 218ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 415ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 288ms

 Test Files  9 passed (9)
      Tests  38 passed (38)
   Start at  22:12:48
   Duration  3.54s (transform 914ms, setup 3.31s, collect 3.05s, tests 1.69s, environment 9.58s, prepare 4.51s)


```

## STDERR
```text

```